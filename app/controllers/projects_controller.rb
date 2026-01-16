class ProjectsController < ApplicationController
  def index
    projects = current_user.projects.map { |project| project.display_hash }
    render inertia: "projects/index", props: { projects: }
  end

  def new
    hackatime_projects = filter_hp_columns current_user.sync_hackatime_projects
    render inertia: "projects/new", props: {
      hackatime_projects:
    }
  end

  def create
    Rails.logger.info("Creating project with params: #{project_params}")
    project = current_user.projects.new(project_params)

    if hackatime_project_keys.empty? || !project.save
      hackatime_projects = filter_hp_columns current_user.sync_hackatime_projects
      render inertia: "projects/new", props: { project: project, hackatime_projects:, errors: project.errors }
      return
    end

    current_user.hackatime_projects.where(id: hackatime_project_keys).update_all(project_id: project.id)

    flash[:success] = "Project created successfully"
    Rails.logger.info("Project created: #{project}")
    redirect_to projects_path
  end

  def show
    project = current_user.projects.find(params[:id]).display_hash
    render inertia: "projects/show", props: { project: }
  end

  def edit
    project = current_user.projects.includes(:hackatime_projects).find(params[:id])
    project_hash = project.display_hash
    hackatime_projects = filter_hp_columns current_user.sync_hackatime_projects
    render inertia: "projects/edit", props: {
      project: project_hash,
      hackatime_projects: hackatime_projects
    }
  end

  def update
    project = current_user.projects.find(params[:id])
    if project.update(project_params)
      flash[:success] = "Project updated successfully"
      redirect_to projects_path
    else
      render inertia: "projects/edit", props: { project: project.display_hash, errors: project.errors }
    end
  end

  def destroy
    project = current_user.projects.find(params[:id])
    if project.destroy
      flash[:success] = "Project deleted successfully"
      redirect_to projects_path
    else
      flash[:error] = "Failed to delete project"
      redirect_to project_path(project)
    end
  end

  def ship
    project = current_user.projects.find(params[:id])
    project.mark_submitted!
    redirect_to projects_path
  end

  private

  def project_params
    params.require(:project).permit(:title, :desc, :demo_link, :repo_link, :reported_hours)
  end

  def hackatime_project_keys
    params[:hackatime_project_keys].map(&:to_i)
  end

  def filter_hp_columns(hackatime_projects)
    hackatime_projects.map do |hp|
      new_hp = hp.as_json.slice("id", "name")
      new_hp["total_seconds"] = hp.total_seconds

      new_hp
    end
  end
end
