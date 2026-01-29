class AdminController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_admin

  def index
    render inertia: "admin/index"
  end

  def announcements
    render inertia: "admin/announcements"
  end

  def projects
    render inertia: "admin/projects", props: { projects: Project.all.map(&:display_hash) }
  end
end
