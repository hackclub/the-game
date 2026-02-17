class AuthController < ApplicationController
  allow_unauthenticated_access only: %i[ account_callback ]
  skip_before_action :redirect_adults, only: %i[ logout ]
  skip_after_action :verify_authorized

  layout false

  def hackatime_link
    if request.headers["X-Inertia"]
      inertia_location generate_hackatime_authorize_link
    else
      redirect_to generate_hackatime_authorize_link, allow_other_host: true
    end
  end

  def logout
    session.delete(:original_id) if session[:original_id]
    terminate_session

    redirect_to root_path, notice: "Signed out successfully. Cya!"
  end

  def account_callback
    begin
      auth = request.env["omniauth.auth"]
      user_info = auth["extra"]["raw_info"]
      account_id = auth["uid"]

      user = User.find_by(account_id:)

      data = {
        account_id:,
        first_name: user_info["given_name"],
        last_name: user_info["family_name"],
        address_street: user_info["address"]&.[]("street_address"),
        address_locality: user_info["address"]&.[]("locality"),
        address_region: user_info["address"]&.[]("region"),
        address_postal: user_info["address"]&.[]("postal_code"),
        address_country: user_info["address"]&.[]("country"),
        birthday: user_info["birthdate"],
        slack_id: user_info["slack_id"],
        verification_status: user_info["verification_status"],
        referral_code: current_user.nil? && user.nil? ? session[:referral_code] : nil
      }

      if user.nil?
        if current_user.present? && current_user.email != user_info["email"]
          redirect_to root_path, alert: "Please log in with the same email"
          return
        end

        if current_user.present?
          user = current_user
        else
          user = User.find_or_create_by!(email: user_info["email"])
        end
      end

      user.update!(data)

      session[:user_id] = user.id
      session.delete(:referral_code)
    rescue StandardError => e
      Rails.logger.error(
        "HCA login failed: #{e.class}: #{e.message}\n#{e.backtrace&.first(10)&.join("\n")}"
      )

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

    current_user.update!(hackatime_id: user_info.body["id"], hackatime_access_token: access_token)

    if current_user.projects.any?
      redirect_to home_path, notice: "Successfully linked Hackatime!"
    else
      redirect_to new_project_path
    end
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

  def generate_hackatime_authorize_link
    state = SecureRandom.hex(24)
    session[:hackatime_state] = state
    "https://hackatime.hackclub.com/oauth/authorize?client_id=#{ENV["HACKATIME_CLIENT_ID"]}&redirect_uri=#{hackatime_callback_url}&response_type=code&scope=profile read&state=#{state}"
  end
end
