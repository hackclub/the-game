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
      render inertia: "projects/new", props: { project: @projects, errors: @projects.errors }
    end
  end

  def show
    @project = Project.find(params[:id])
    render inertia: 'projects/show', props: { project: @project }
  end

  def ship
    @project = Project.find(params[:id])
    @project.update!(approved: :shipped)
    redirect_to projects_path
  end

  def edit
    @project = Project.find(params[:id])
    render inertia: 'projects/edit', props: { project: @project }
  end

  def update
    @project = Project.find(params[:id])
    if @project.update(project_params)
      flash[:success] = "Project updated successfully"
      redirect_to projects_path
    else
      render inertia: 'projects/edit', props: { project: @project, errors: @project.errors }
    end
  end

  def destroy
    @project = Project.find(params[:id])
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
end
