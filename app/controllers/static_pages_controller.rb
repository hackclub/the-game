class StaticPagesController < ApplicationController
  allow_unauthenticated_access only: %i[index create_rsvp signup index]
  skip_after_action :verify_authorized, only: %i[index create_rsvp signup index home]

  def home
    unless user_logged_in?
      redirect_to root_path
      return
    end

    totalProjectTime = current_user.total_seconds
    announcements = SlackAnnouncementsService.available? ? SlackAnnouncementsService.fetch_announcements : []
    render inertia: { totalProjectTime: totalProjectTime, projectCount: current_user.projects.count, announcements: announcements }
  end

  def index
    render inertia: { signed_in: user_logged_in? }
  end

  def create_rsvp
    email = params[:email]
    origin_ip = request.headers["CF-Connecting-IP"] ||
                request.headers["X-Forwarded-For"]&.split(",")&.first&.strip ||
                request.remote_ip

    AirtableService.new.create_rsvp(email: email, origin_ip: origin_ip) if AirtableService.available?

    redirect_to root_path, notice: "RSVP received! We'll be in touch soon."
  end

  def signup
    email = params[:email]

    if request.inertia?
      render inertia: "Redirect", props: { url: "/auth/start?email=" + email }
    else
      redirect_to "/auth/start"
    end
  end
end
