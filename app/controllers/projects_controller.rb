class ProjectsController < ApplicationController
  skip_after_action :verify_authorized, only: [ :index, :new, :create ]
  before_action :set_project, only: [ :show, :update, :destroy ]

  def index
    projects = current_user.projects.map { |project| project.display_hash }
    render inertia: "projects/index", props: { projects: }
  end

  def new
    render inertia: "projects/new", props: {
      hackatime_projects: available_hackatime_projects
    }
  end

  def create
    project = current_user.projects.new(project_params)

    if !project.save
      redirect_to new_project_path, inertia: { project: project, hackatime_projects: available_hackatime_projects, errors: project.errors }
      return
    end

    current_user.hackatime_projects.where(id: hackatime_project_keys).update_all(project_id: project.id)

    flash[:notice] = "Project created successfully"
    redirect_to projects_path
  end

  def show
    authorize @project
    project_hash = @project.display_hash
    hackatime_projects = available_hackatime_projects + @project.hackatime_projects.map(&:display_hash)
    render inertia: "projects/show", props: {
      project: project_hash,
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

    flash[:notice] = "Project updated successfully"
    redirect_to projects_path
  rescue
    hackatime_projects = available_hackatime_projects + @project.hackatime_projects.map(&:display_hash)
    render inertia: "projects/show", props: { project: @project.display_hash, hackatime_projects: hackatime_projects, errors: @project.errors }
  end

  def destroy
    authorize @project

    if @project.destroy
      flash[:notice] = "Project deleted successfully"
      redirect_to projects_path
    else
      flash[:alert] = "Failed to delete project"
      redirect_to project_path(@project)
    end
  end

  def ship
    authorize @project

    @project.mark_submitted!
    flash[:notice] = "Shipped #{@project.title}!"
    redirect_to project_path(@project)
  end

  private

  def project_params
    params.require(:project).permit(:title, :desc, :demo_link, :reported_hours)
  end

  def hackatime_project_keys
    keys = params[:hackatime_project_keys].map(&:to_i)
    HackatimeProject.where(id: keys, user: current_user).pluck(:id)
  end

  def available_hackatime_projects
    current_user.unassigned_hackatime_projects.map(&:display_hash)
  end

  def set_project
    @project = Project.find(params[:id])
  end
end
