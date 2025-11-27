class AuthController < ApplicationController
  allow_unauthenticated_access only: %i[ create_email start account_callback validate sent ]
  skip_before_action :redirect_adults, only: %i[ logout ]

  layout false

  before_action :set_after_login_redirect, only: %i[ create_email ]
  before_action :redirect_if_logged_in, only: %i[ create_email ]

  def create_email
    email = params[:email]

    if email.blank? || !(email =~ URI::MailTo::EMAIL_REGEXP)
      flash.now[:alert] = "Invalid email address."
      return
    end

    if send_otp(email)
      redirect_to sent_path(email:)
    else
      flash.now[:alert] = "Failed to send OTP. Please try again."
    end
  end

  def sent
    email = params[:email]

    render inertia: { email: }
  end

  def validate
    email = params[:email]
    otp = params[:otp]

    if validate_otp(email, otp)
      referrer_id = cookies[:referrer_id]&.to_i
      user = User.find_or_create_by(email:)

      reset_session
      session[:user_id] = user.id

      # Clear the referrer cookie after successful signup
      cookies.delete(:referrer_id) if referrer_id

      redirect_to home_path
    else
      flash.now[:alert] = "Invalid OTP. Please try again."
      redirect_to root_path
    end
  end

  def logout
    session.delete(:original_id) if session[:original_id]
    terminate_session

    redirect_to root_path, notice: "Signed out successfully. Cya!"
  end

  def start
    state = SecureRandom.hex(24)
    session[:auth_state] = state
    account_link = "https://account.hackclub.com/oauth/authorize?client_id=#{ENV["ACCOUNT_CLIENT_ID"]}&redirect_uri=#{account_callback_url}&response_type=code&scope=email name slack_id verification_status&state=#{state}"
    redirect_to account_link, allow_other_host: true
  end

  def account_callback
    begin
      unless params[:state].present? && params[:state] == session[:auth_state]
        redirect_to root_path, alert: "Invalid account session. Please try again."
        return
      end

      session.delete(:auth_state)

      access_token = User.exchange_authorization_code(params[:code])

      if access_token.nil?
        redirect_to root_path, alert: "Failed to log in. Please try again."
        return
      end

      user_info = User.account_user_info(access_token)

      user = User.find_by(account_id: user_info["id"])
      if user.nil?
        if current_user.present?
          current_user.update!(account_id: user_info["id"], account_access_token: access_token, slack_id: user_info["slack_id"])
        else
          user = User.create!(account_id: user_info["id"], account_access_token: access_token, email: user_info["primary_email"], slack_id: user_info["slack_id"])
        end
      end

      session[:user_id] = user.id
    rescue StandardError => e
      Rails.logger.error(e)
      return redirect_to root_path, alert: "Couldn't log in: #{e.message}"
    end

    redirect_to home_path, notice: "Successfully logged in!"
  end

  private

  def redirect_if_logged_in
    return unless user_logged_in?

    redirect_to(post_login_redirect_path || home_path)
  end

  def set_after_login_redirect
    path = safe_redirect_path(params[:redirect_to])
    session[:after_login_redirect] = path if path.present?
  end

  def post_login_redirect_path
    session.delete(:after_login_redirect) || safe_redirect_path(params[:redirect_to])
  end

  def safe_redirect_path(url)
    return nil if url.blank?

    begin
      uri = URI.parse(url)
      if uri.scheme.nil? && uri.host.nil? && uri.path.present? && uri.path.start_with?("/")
        return uri.path + (uri.query.present? ? "?#{uri.query}" : "")
      end
    rescue URI::InvalidURIError
    end

    nil
  end

  def send_otp(email)
    otp = OneTimePassword.create!(email: email)
    otp.send!
  end

  def validate_otp(email, otp)
    OneTimePassword.valid?(otp, email)
  end
end
