class ProjectsController < ApplicationController
  skip_after_action :verify_authorized, only: [ :index, :new, :create ]
  before_action :set_project, only: [ :show, :update, :destroy, :ship, :check_repo ]

  def index
    projects = current_user.projects.map { |project| project.display_hash }
    render inertia: "projects/index", props: { projects: }
  end

  def new
    track_event("project_creation_started", {
      projects_count: current_user.projects.count
    })

    render inertia: "projects/new", props: {
      hackatime_projects: available_hackatime_projects,
      tags: Project::Tag.all.map(&:display_hash),
      projects_count: current_user.projects.count
    }
  end

  def create
    project = current_user.projects.new(project_params)

    if !project.save
      track_event("project_creation_failed", {
        errors: project.errors.full_messages
      })
      redirect_to new_project_path, inertia: { project: project, hackatime_projects: available_hackatime_projects, errors: project.errors }
      return
    end

    current_user.hackatime_projects.where(id: hackatime_project_keys).update_all(project_id: project.id)

    track_event("project_created", {
      project_id: project.id,
      has_repo_link: project.repo_link.present?,
      has_demo_link: project.demo_link.present?,
      has_screenshot: project.screenshot.attached?,
      hackatime_project_count: hackatime_project_keys.count
    })

    flash[:notice] = "Project created successfully"
    redirect_to projects_path
  end

  def show
    authorize @project
    project_hash = @project.display_hash(user: true, reviews: true, admin: current_user.admin?, reviewer: current_user.reviewer?)

    ship_versions = @project.versions.where_object_changes_to(aasm_state: :submitted)
    ships = ship_versions.map.with_index do |version, index|
      diff = index == 0 ? {} : @project.diff(ship_versions[index - 1].object)

      { id: version.id, date: version.created_at.to_s, diff: }
    end

    hackatime_projects = available_hackatime_projects(user: @project.user) + @project.hackatime_projects.map(&:display_hash)
    @project.mark_notifications_read

    @og_title = @project.title.present? ? "#{@project.title} – Hack Club: The Game" : "Hack Club: The Game"
    @og_description = @project.desc.presence || "A project on Hack Club: The Game"
    @og_image = rails_blob_url(@project.screenshot, disposition: :inline) if @project.screenshot.attached?

    render inertia: "projects/show", props: {
      project: project_hash,
      ships:,
      tags: Project::Tag.all.map(&:display_hash),
      hackatime_projects: hackatime_projects
    }
  end

  def update
    authorize @project

    ActiveRecord::Base.transaction do
      @project.update!(project_params)
      @project.hackatime_projects.update_all(project_id: nil)
      @project.user.hackatime_projects.where(id: hackatime_project_keys).update_all(project_id: @project.id)
    end

    track_event("project_updated", {
      project_id: @project.id,
      missing_fields: @project.missing_fields
    })

    flash[:notice] = "Project updated successfully"
    redirect_back_or_to project_path(@project)
  rescue
    hackatime_projects = available_hackatime_projects(user: @project.user) + @project.hackatime_projects.map(&:display_hash)
    render inertia: "projects/show", props: { project: @project.display_hash, hackatime_projects: hackatime_projects, errors: @project.errors }
  end

  def destroy
    authorize @project

    if @project.destroy
      track_event("project_deleted", {
        project_id: @project.id,
        project_state: @project.aasm_state
      })
      flash[:notice] = "Project deleted successfully"
      redirect_to projects_path
    else
      flash[:alert] = "Failed to delete project"
      redirect_to project_path(@project)
    end
  end

  SHIPPING_PAUSE_START = Time.parse("2026-05-10 21:02:00 UTC").freeze
  SHIPPING_RESUME = Time.parse("2026-05-11 21:00:00 UTC").freeze

  def ship
    authorize @project

    if Time.current >= SHIPPING_PAUSE_START && Time.current < SHIPPING_RESUME
      track_event("project_ship_failed", {
        project_id: @project.id,
        reason: "shipping_paused"
      })
      redirect_to project_path(@project), flash: { alert: "Shipping is temporarily paused as reviewers work to review projects of people who are qualifying for the HCTG event. It will be unpaused at 5:00pm ET on May 11th, 2026." }
      return
    end

    unless current_user.idv_verified?
      track_event("project_ship_failed", {
        project_id: @project.id,
        reason: "idv_not_verified"
      })
      redirect_to project_path(@project), flash: { alert: "Verify your identity to be able to get your projects reviewed." }
      return
    end

    if @project.missing_fields.any?
      track_event("project_ship_failed", {
        project_id: @project.id,
        missing_fields: @project.missing_fields
      })
      redirect_to project_path(@project), flash: { alert: "Cannot ship without #{@project.missing_fields.join(", ") }" }
      return
    end

    unless repo_accessible?(@project.repo_link) || (@project.repo_link.present? && !is_github?(@project.repo_link))
      track_event("project_ship_failed", {
        project_id: @project.id,
        reason: "repo_not_accessible"
      })
      redirect_to project_path(@project), flash: { alert: "Could not access repo. Is it private?" }
      return
    end

    @project.mark_submitted!

    track_event("project_shipped", {
      project_id: @project.id,
      total_seconds: @project.total_seconds,
      hackatime_project_count: @project.hackatime_projects.count
    })

    flash[:notice] = "Shipped #{@project.title}!"
    redirect_back_or_to projects_path
  end

  def check_repo
    authorize @project
    is_github = is_github?(@project.repo_link)
    accessible = repo_accessible?(@project.repo_link)
    has_readme = accessible ? readme_exists?(@project.repo_link) : false
    render json: { is_github:, accessible: accessible, has_readme: has_readme }
  end

  private

  def project_params
    p = params.permit(:title, :desc, :demo_link, :repo_link, :ai_declaration)

    unless params[:screenshot] == "0"
      p[:screenshot] = params[:screenshot]
    end

    if params[:tags].present?
      p[:tags] = Project::Tag.where(id: params[:tags].values.map(&:to_i))
    else
      p[:tags] = []
    end

    p
  end

  def hackatime_project_keys
    if params[:hackatime_project_keys].present?
      keys = params[:hackatime_project_keys].values.map(&:to_i)
      HackatimeProject.where(id: keys, user: current_user).pluck(:id)
    else
      []
    end
  end

  def available_hackatime_projects(user: current_user)
    user.unassigned_hackatime_projects.map(&:display_hash)
  end

  def set_project
    @project = Project.find(params[:id])
  end

  def is_github?(url)
    uri = URI.parse(url)
    uri.host&.include?("github.com")
  end

  def github_repo_parts(url)
    uri = URI.parse(url)
    return nil unless uri.host&.include?("github.com")

    parts = uri.path.chomp("/").split("/").reject(&:blank?)
    return nil unless parts.length >= 2

    [ parts[0], parts[1] ]
  rescue URI::InvalidURIError
    nil
  end

  def github_api_get(path)
    uri = URI.parse("https://api.github.com#{path}")
    Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 5, read_timeout: 5) do |http|
      http.get(uri.request_uri, { "User-Agent" => "HackClub-TheGame", "Accept" => "application/vnd.github+json" })
    end
  rescue StandardError
    nil
  end

  def repo_accessible?(url)
    return false if url.blank?

    repo = github_repo_parts(url)
    return false unless repo

    response = github_api_get("/repos/#{repo[0]}/#{repo[1]}")
    response&.code&.to_i == 200
  end

  def readme_exists?(url)
    return false if url.blank?

    repo = github_repo_parts(url)
    return false unless repo

    response = github_api_get("/repos/#{repo[0]}/#{repo[1]}/readme")
    response&.code&.to_i == 200
  end
end
