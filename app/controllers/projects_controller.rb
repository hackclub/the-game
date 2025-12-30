class ProjectsController < ApplicationController
  def index
    @projects = current_user.projects
    render inertia: 'projects/index', props: { projects: @projects }
  end

  def new
    render inertia: "projects/new"
  end

  def create
    Rails.logger.info("Creating project with params: #{project_params}")
    @projects = current_user.projects.create(project_params)

    if @projects.save
      flash[:success] = "Project created successfully"
      Rails.logger.info("Project created: #{@projects}")
      redirect_to projects_path
    else
      render inertia: "projects/new", props: { project: @projects }
    end
  end

  private
  def project_params
    params.require(:project).permit(:title, :desc, :demo_link, :repo_link)
  end
end
