class AdminController < ApplicationController
  def index
   @admin = current_user.admin?
   unless @admin
     redirect_to root_path, alert: "You are not authorized to access this page."
   else
     render inertia "admin/index", props: { admin: @admin }
   end
  end
end
