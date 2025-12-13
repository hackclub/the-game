class ProjectsController < ApplicationController
  def index
    hackatime_stats = fetch_hackatime_project_stats
    projects = current_user.projects.map do |project|
      stats = hackatime_stats[project.hackatime_name] || {}
      {
        id: project.id,
        name: project.name,
        hackatime_name: project.hackatime_name,
        repo_url: project.repo_url,
        total_seconds: stats[:total_seconds] || 0,
        hours: stats[:hours] || 0
      }
    end

    linked_project_names = current_user.projects.pluck(:hackatime_name)
    available_hackatime_projects = fetch_available_hackatime_projects(linked_project_names)

    render inertia: {
      user: {
        id: current_user.id,
        email: current_user.email,
        username: current_user.username,
        slack_id: current_user.slack_id,
        admin: current_user.admin?
      },
      projects: projects,
      availableHackatimeProjects: available_hackatime_projects
    }
  end

  def create
    project = current_user.projects.build(project_params)

    if project.save
      redirect_to projects_path, notice: "Project created successfully"
    else
      redirect_to projects_path, inertia: { errors: project.errors }
    end
  end

  def update
    project = current_user.projects.find(params[:id])

    if project.update(update_project_params)
      redirect_to projects_path, notice: "Project updated successfully"
    else
      redirect_to projects_path, inertia: { errors: project.errors }
    end
  end

  def destroy
    project = current_user.projects.find(params[:id])
    project.destroy
    redirect_to projects_path, notice: "Project deleted successfully"
  end

  private

  def project_params
    params.require(:project).permit(:name, :repo_url, :hackatime_name)
  end

  def update_project_params
    params.require(:project).permit(:name, :repo_url)
  end

  def fetch_available_hackatime_projects(exclude_names)
    return [] unless current_user.hackatime_id.present?

    response = hackatime_client.get("users/#{current_user.hackatime_id}/projects")

    if response.success? && response.body["projects"].present?
      response.body["projects"]
        .reject { |name| name == "Unknown Project" || exclude_names.include?(name) }
    else
      []
    end
  end

  def fetch_hackatime_project_stats
    return {} unless current_user.hackatime_id.present?

    response = hackatime_client.get("users/#{current_user.hackatime_id}/projects/details")

    if response.success? && response.body["projects"].present?
      response.body["projects"].each_with_object({}) do |project, hash|
        hash[project["name"]] = {
          total_seconds: project["total_seconds"].to_i,
          hours: (project["total_seconds"].to_f / 3600).round(1),
          languages: project["languages"] || []
        }
      end
    else
      {}
    end
  end

  def hackatime_client
    Faraday.new(url: "https://hackatime.hackclub.com/api/v1", headers: { "Authorization" => "Bearer #{ENV["HACKATIME_API_KEY"]}" }) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
