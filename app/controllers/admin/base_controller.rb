module Admin
  class BaseController < ApplicationController
    before_action :require_admin!

    private

    def require_admin!
      return if current_user&.admin?

      redirect_to root_path, alert: "You are not authorized to access this page."
    end
  end
end
