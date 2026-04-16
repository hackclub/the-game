module Admin
  class ProjectsController < ApplicationController
    before_action :signed_in_admin
    skip_after_action :verify_authorized

    def new
      render inertia: "admin/projects/new", props: {
        tags: Project::Tag.all.map(&:display_hash)
      }
    end

    def create
      user = User.find_by(id: params[:user_id])

      unless user
        redirect_to new_admin_project_path, inertia: { errors: [ "User not found" ] }
        return
      end

      project = user.projects.new(project_params)

      state = params[:aasm_state].presence
      if state.present? && %w[pending submitted approved rejected].include?(state)
        project.aasm_state = state

        case state
        when "approved"
          project.approved_at = Time.current
          project.submitted_at = Time.current
          project.approved_seconds = params[:approved_seconds].to_i if params[:approved_seconds].present?
        when "submitted"
          project.submitted_at = Time.current
          project.total_seconds = params[:total_seconds].to_i if params[:total_seconds].present?
        when "rejected"
          project.submitted_at = Time.current
          project.rejected_at = Time.current
        end
      end

      if project.save
        if params[:hackatime_project_keys].present?
          user.hackatime_projects.where(id: params[:hackatime_project_keys].values.map(&:to_i)).update_all(project_id: project.id)
        end

        flash[:notice] = "Project created successfully for #{user.username}"
        redirect_to admin_projects_path
      else
        redirect_to new_admin_project_path, inertia: { errors: project.errors.full_messages }
      end
    end

    private

    def project_params
      p = params.permit(:title, :desc, :demo_link, :repo_link, :ai_declaration)
      p[:screenshot] = params[:screenshot] if params[:screenshot].present?
      p
    end
  end
end
