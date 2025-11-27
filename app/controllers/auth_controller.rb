class AuthController < ApplicationController
  allow_unauthenticated_access only: %i[ index new create create_email submit_age ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to "TODO", alert: "Try again later." }
  skip_forgery_protection only: %i[ track ]
  skip_before_action :redirect_to_age, only: %i[ age submit_age destroy ]
  skip_before_action :redirect_adults, only: %i[ destroy ]

  layout false

  before_action :set_after_login_redirect, only: %i[ index new create_email ]
  before_action :redirect_if_logged_in, only: %i[ index new create create_email ]

  def index
    render "auth/index", layout: false
  end

  # HCA auth start
  def new
    # TODO: implement HCA auth
  end

  # email login
  def create_email
    email = params[:email]
    otp = params[:otp]

    if email.blank? || !(email =~ URI::MailTo::EMAIL_REGEXP)
      flash.now[:alert] = "Invalid email address."
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace(
              "flash",
              partial: "shared/notice"
            )
          ]
        end
      end
      return
    end

    if otp.present?
      if validate_otp(email, otp)
        referrer_id = cookies[:referrer_id]&.to_i
        user = User.find_or_create_from_email(email, referrer_id: referrer_id)
        ahoy.track("email_login", user_id: user&.id)
        reset_session
        session[:user_id] = user.id

        # Clear the referrer cookie after successful signup
        cookies.delete(:referrer_id) if referrer_id

        Rails.logger.info("OTP validated for email: #{email}")
        redirect_target = post_login_redirect_path
        redirect_to(redirect_target || home_path)
      else
        flash.now[:alert] = "Invalid OTP. Please try again."
        respond_to do |format|
          format.turbo_stream do
            render turbo_stream: [
              turbo_stream.replace(
                "flash",
                partial: "shared/notice"
              )
            ]
          end
        end
      end
      return
    end

    if send_otp(email)
      ahoy.track "email_login_start"

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "login_form",
            partial: "auth/otp_form",
            locals: { email: email }
          )
        end
      end
    else
      flash.now[:alert] = "Failed to send OTP. Please try again."
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace(
              "flash",
              partial: "shared/notice",
            ),
            turbo_stream.replace(
              "login_form",
              partial: "auth/email_form"
            )
          ]
        end
      end
    end
  end

  # HCA auth callback
  def create
    # TODO: implement HCA auth
  end

  # Logout
  def destroy
    session.delete(:original_id) if session[:original_id]
    terminate_session

    # clear Ahoy cookies
    cookies.delete(:ahoy_visit)
    cookies.delete(:ahoy_visitor)

    redirect_to root_path, notice: "Signed out successfully. Cya!"
  end

  def idv
    render "projects/ship_idv", layout: "application"
  end

  def idv_start
    state = SecureRandom.hex(24)
    session[:idv_state] = state
    idv_link = current_user.identity_vault_oauth_link(idv_callback_url, state: state)
    redirect_to idv_link, allow_other_host: true
  end

  def idv_callback
    begin
      unless params[:state].present? && params[:state] == session[:idv_state]
        redirect_to home_path, alert: "Invalid identity verification session. Please try again."
        return
      end

      session.delete(:idv_state)
      current_user.link_identity_vault_callback(idv_callback_url, params[:code])
    rescue StandardError => e
      return redirect_to home_path, alert: "Couldn't link identity: #{e.message} (ask support about error ID #{event_id}?)"
    end

    redirect_to home_path, notice: "Successfully linked your identity."
  end

  def age
    render "age", layout: false
  end

  def submit_age
    unless current_user
      redirect_to login_path, alert: "Please log in first"
      return
    end

    birthday = params[:birthday]
    if birthday.blank?
      redirect_to age_verification_path, alert: "Please enter your birthday"
      return
    end

    begin
      birthday_date = Date.parse(birthday)
    rescue ArgumentError
      redirect_to age_verification_path, alert: "Invalid date format"
      return
    end

    age = ((Time.zone.now - birthday_date.to_time) / 1.year.seconds).floor

    if age < 13
      current_user.update!(birthday: birthday_date, is_banned: true, ban_type: :age)
      redirect_to sorry_path, alert: "You must be at least 13 years old for Hack Club: The Game"
    elsif age > 18
      current_user.update!(birthday: birthday_date)
      redirect_to home_path, notice: "Thanks! You can still refer teens to Hack Club: The Game for rewards"
    else
      current_user.update!(birthday: birthday_date)
      redirect_to home_path, notice: "Welcome to Hack Club: The Game!"
    end
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
