class AdminController < ApplicationController
  def index 
    @user = current_user
    @admin = current_user.admin?
    Rails.logger.info("Admin index page accessed")
    render inertia "admin/index", props: { user: @user, admin: @admin }
  end
end
