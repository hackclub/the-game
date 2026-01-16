class AdminController < ApplicationController
  def index
    @user = current_user
    unless @user.admin?
      redirect_to root_path, alert: "You are not authorized to access this page."
    end
    render inertia: "admin/index", props: { user: @user }
  end
end
