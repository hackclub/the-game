class AdminController < ApplicationController
  before_action :verify_admin

  def index
    render inertia: "admin/index"
  end

  def announcements
    render inertia: "admin/announcements"
  end

  def projects
    render inertia: "admin/projects", props: { projects: Project.all.map(&:display_hash) }
  end

  private

  def verify_admin
    unless current_user.admin?
      redirect_to home_path, alert: "You are not authorized to access this page."
    end
  end
end
