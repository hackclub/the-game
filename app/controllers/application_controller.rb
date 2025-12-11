class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern


  include Authentication

  before_action :set_paper_trail_whodunnit
  before_action :update_last_active
  before_action :redirect_banned_users
  before_action :redirect_adults

  def not_found
    raise ActionController::RoutingError.new("Not Found")
  end

  private

  def update_last_active
    return unless current_user
    return if current_user.last_active && current_user.last_active > 5.minutes.ago

    current_user.update_column(:last_active, Time.current)
  end

  def redirect_banned_users
    return unless user_logged_in?
    return unless current_user.is_banned

    redirect_to sorry_path
  end

  def redirect_adults
    return unless user_logged_in?
    return unless current_user.birthday.present?
    return unless current_user.is_adult?

    redirect_to adult_path
  end
end
