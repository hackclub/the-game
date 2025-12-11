class StaticPagesController < ApplicationController
  allow_unauthenticated_access only: %i[rsvp create_rsvp index]

  def index
    render inertia: {}
  end

  def home
    unless user_logged_in?
      redirect_to root_path
      return
    end

    render inertia: { account_linked: current_user.account_id.present?, hackatime_linked: current_user.hackatime_id.present? }
  end

  def rsvp
    if user_logged_in?
      redirect_to home_path
      return
    end

    render inertia: {}
  end

  def create_rsvp
    email = params[:email]
    origin_ip = request.headers["CF-Connecting-IP"] ||
                request.headers["X-Forwarded-For"]&.split(",")&.first&.strip ||
                request.remote_ip

    AirtableService.new.create_rsvp(email: email, origin_ip: origin_ip)

    redirect_to root_path, notice: "RSVP received! We'll be in touch soon."
  end
end
