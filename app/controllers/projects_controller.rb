class ProjectsController < ApplicationController
  def index
    @projects = current_user.projects
    render inertia: 'projects/index', props: { projects: @projects }
  end

  def new
    @hackatime_projects = current_user.hackatime_projects.select(:id, :name)
    render inertia: "projects/new", props: { 
      hackatime_projects: @hackatime_projects,
      project_times: fetch_project_times
    }
  end


  def create
    Rails.logger.info("Creating project with params: #{project_params}")
    @project = current_user.projects.new(project_params)

    if @project.save
      link_hackatime_projects
      flash[:success] = "Project created successfully"
      Rails.logger.info("Project created: #{@project}")
      redirect_to projects_path
    else
      render inertia: "projects/new", props: { project: @project, errors: @project.errors }
    end
  end

  def show
    @project = current_user.projects.find(params[:id])
    render inertia: 'projects/show', props: { project: @project }
  end

  def ship
    @project = current_user.projects.find(params[:id])
    @project.update!(approved: :shipped)
    redirect_to projects_path
  end

  def edit
    @project = current_user.projects.find(params[:id])
    render inertia: 'projects/edit', props: { project: @project }
  end

  def update
    @project = current_user.projects.find(params[:id])
    if @project.update(project_params)
      flash[:success] = "Project updated successfully"
      redirect_to projects_path
    else
      render inertia: 'projects/edit', props: { project: @project, errors: @project.errors }
    end
  end

  def destroy
    @project = current_user.projects.find(params[:id])
    if @project.destroy
      flash[:success] = "Project deleted successfully"
      redirect_to projects_path
    else
      flash[:error] = "Failed to delete project"
      redirect_to project_path(@project)
    end
  end


  private
  def project_params

    params.require(:project).permit(:title, :desc, :demo_link, :repo_link)
  end

def hackatime_project_ids
  Array(params.dig(:project, :hackatime_project_ids)).map(&:to_i).reject(&:zero?)
end

def link_hackatime_projects
  return if hackatime_project_ids.empty?
  current_user.hackatime_projects.where(id: hackatime_project_ids).update_all(project_id: @project.id)
end

def fetch_project_times
  return {} unless current_user.slack_id.present?
  
  response = User.hackatime_client.get("users/#{current_user.slack_id}/stats") do |req|
    req.params = { features: "projects", start_date: "2025-12-23" }
  end
  
  return {} unless response.success?
  
  # Returns { "project-name" => seconds, ... }
  response.body.dig("data", "projects")&.each_with_object({}) do |p, hash|
    hash[p["name"]] = p["total_seconds"]
  end || {}
end
end
