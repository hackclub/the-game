class AuthController < ApplicationController
  allow_unauthenticated_access only: %i[ create_email start account_callback validate sent create_or_login_user ]
  skip_before_action :redirect_adults, only: %i[ logout ]
  skip_after_action :verify_authorized

  layout false

  before_action :set_after_login_redirect, only: %i[ create_email ]
  before_action :redirect_if_logged_in, only: %i[ create_email ]

  def create_or_login_user
    email = params[:email]
    user = User.find_or_create_by(email:)
    session[:pending_user_id] = user.id
    account_link = generate_hca_authorize_link(email)
    inertia_location account_link
  end

  def account_link
    account_link = generate_hca_authorize_link
    inertia_location account_link
  end

  def hackatime_link
    inertia_location generate_hackatime_authorize_link
  end

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

      access_token = User.exchange_authorization_code(params[:code], host: request.base_url)

      if access_token.nil?
        redirect_to root_path, alert: "Failed to log in. Please try again."
        return
      end

      user_info = User.account_user_info(access_token)

      user = User.find_by(account_id: user_info["id"])
      if user.nil?
        current_or_pending_user = current_user || User.find(session[:pending_user_id])

        if current_or_pending_user.email != user_info["primary_email"]
          redirect_to root_path, alert: "Please log in with the same email"
          return
        end

        if current_or_pending_user.present?
          current_or_pending_user.update!(account_id: user_info["id"], account_access_token: access_token, slack_id: user_info["slack_id"], verification_status: user_info["verification_status"], referral_code: current_user.nil? ? session[:referral_code] : nil)
          user = current_or_pending_user
        else
          user = User.create!(account_id: user_info["id"], account_access_token: access_token, email: user_info["primary_email"], slack_id: user_info["slack_id"], verification_status: user_info["verification_status"], referral_code: session[:referral_code])
        end
      end

      session[:user_id] = user.id
      session.delete(:referral_code)
    rescue StandardError => e
      return redirect_to root_path, alert: "Couldn't log in: #{e.message}"
    end

    redirect_to home_path, notice: "Successfully logged in!"
  end

  def hackatime_callback
    unless params[:state].present? && params[:state] == session[:hackatime_state]
      redirect_to home_path, alert: "Invalid hackatime session. Please try again."
      return
    end

    session.delete(:hackatime_state)

    access_token = User.exchange_hackatime_code(params[:code], host: request.base_url)
    user_info = User.hackatime_user_info(access_token)

    current_user.update!(hackatime_id: user_info.body["id"])

    redirect_to home_path, notice: "Successfully linked Hackatime!"
  rescue StandardError => e
    redirect_to home_path, alert: "Couldn't link hackatime: #{e.message}"
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

  def generate_hca_authorize_link(email = nil)
    state = SecureRandom.hex(24)
    session[:auth_state] = state
    "https://account.hackclub.com/oauth/authorize?client_id=#{ENV["ACCOUNT_CLIENT_ID"]}&redirect_uri=#{account_callback_url}&response_type=code&scope=email name slack_id verification_status&state=#{state}#{"&login_hint=#{email}" if email.present?}"
  end

  def generate_hackatime_authorize_link
    state = SecureRandom.hex(24)
    session[:hackatime_state] = state
    "https://hackatime.hackclub.com/oauth/authorize?client_id=#{ENV["HACKATIME_CLIENT_ID"]}&redirect_uri=#{hackatime_callback_url}&response_type=code&scope=profile read&state=#{state}"
  end
end
