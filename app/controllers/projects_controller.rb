class ProjectsController < ApplicationController
  skip_after_action :verify_authorized, only: [ :index, :new, :create ]
  before_action :set_project, only: [ :show, :update, :destroy, :ship ]

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

  def ship
    authorize @project

    if @project.missing_fields.any?
      track_event("project_ship_failed", {
        project_id: @project.id,
        missing_fields: @project.missing_fields
      })
      redirect_to project_path(@project), flash: { alert: "Cannot ship without #{@project.missing_fields.join(", ") }" }
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

  private

  def project_params
    p = params.permit(:title, :desc, :demo_link, :repo_link)

    unless params[:screenshot] == "0"
      p[:screenshot] = params[:screenshot]
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
end
