# frozen_string_literal: true

module Authentication
  extend ActiveSupport::Concern

  included do
      before_action :set_current_user
      before_action :authenticate_user!
      before_action :ensure_allowed_user!
      helper_method :current_user, :user_logged_in?
  end

  class_methods do
    def allow_unauthenticated_access(only: nil)
      skip_before_action :authenticate_user!, only: only
      before_action :set_referral_code, only: only
    end
  end

  private

  def authenticate_user!
    unless current_user
      redirect_to main_app.root_path, alert: "You need to be logged in to see this!"
    end
  end

  def set_referral_code
    referral_code = params[:r] || params[:ref]
    session[:referral_code] = referral_code if referral_code.present?
  end

  def ensure_allowed_user!
    return unless current_user
    nil if current_user.admin?
  end

  def user_logged_in?
    current_user.present?
  end

  def set_current_user
    uid = session[:user_id]
    oid = session[:original_id]

    if oid
      original_user = User.find_by(id: oid)
      if original_user&.admin?
        impersonated = User.find_by(id: uid)
        if impersonated
          @current_user = impersonated
        else
          reset_session
          session[:user_id] = original_user.id
          @current_user = original_user
        end
      else
        reset_session
        session[:user_id] = original_user.id if original_user
        @current_user = original_user
      end
    else
      @current_user = User.find_by(id: uid)
    end
  end

  def current_user
    @current_user
  end

  def original_user
    @original_user ||= User.find_by(id: session[:original_id]) if session[:original_id]
  end

  def impersonating?
    session[:original_id].present?
  end

  def terminate_session
    reset_session
  end

  def signed_in_admin
    unless current_user.admin?
      redirect_back_or_to home_path, flash: { alert: "You'll need to sign in as an admin" }
    end
  end

  def signed_in_reviewer
    unless current_user.admin? || current_user.reviewer?
      redirect_back_or_to home_path, flash: { alert: "You'll need to sign in as an admin/reviewer" }
    end
  end
end
