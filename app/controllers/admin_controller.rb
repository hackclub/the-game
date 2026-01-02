class AdminController < ApplicationController
  def index 
    Rails.logger.info("Admin index page accessed")
    render inertia "admin/index", props: { admin: current_user.admin? }
  end
end
