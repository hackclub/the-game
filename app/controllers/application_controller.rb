class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern

  include Authentication
  include Pundit::Authorization
  include PosthogTrackable

  before_action :set_paper_trail_whodunnit
  before_action :update_last_active
  before_action :refresh_unverified_idv_status
  before_action :redirect_banned_users
  before_action :redirect_adults

  after_action :verify_authorized

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  inertia_share do
    if user_logged_in?
      user_hash = current_user.display_hash(private: true)
      user_hash["project_count"] = current_user.projects.count unless current_user.onboarding_completed?
      user_hash["unread_notification_count"] = current_user.notifications.unread.count
      user_hash["unread_project_notification_count"] = current_user.notifications.unread.where(notifiable_type: "Project::Review").count
      user_hash["referral_program_active"] = ReferralProgram.instance.active?
      { user: user_hash }
    else
      {}
    end
  end

  def not_found
    raise ActionController::RoutingError.new("Not Found")
  end

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    if current_user || !request.get?
      redirect_back_or_to root_path
    else
      redirect_to auth_users_path(return_to: request.url, require_reload: true)
    end
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

  def refresh_unverified_idv_status
    return unless user_logged_in?
    return if current_user.idv_verified?

    current_user.refresh_verification_status!
  end

  def redirect_adults
    return unless user_logged_in?
    return unless current_user.birthday.present?
    return unless current_user.is_banned

    redirect_to adult_path
  end
end
