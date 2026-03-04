class UsersController < ApplicationController
  def show
    if params[:id].present? && !current_user.admin?
      raise Pundit::NotAuthorizedError
    end

    skip_authorization

    user = params[:id].present? ? User.find(params[:id]) : current_user

    render inertia: "users/show", props: { page_user: user.display_hash(private: true), custom: params[:id].present? }
  end
end
