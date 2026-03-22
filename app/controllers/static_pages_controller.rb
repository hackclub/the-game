class StaticPagesController < ApplicationController
  allow_unauthenticated_access only: %i[index create_rsvp signup index]
  skip_after_action :verify_authorized, only: %i[index create_rsvp signup index home]

  def home
    unless user_logged_in?
      redirect_to root_path
      return
    end

    track_event("dashboard_viewed", {
      project_count: current_user.projects.count,
      onboarding_completed: current_user.onboarding_completed?,
      hackatime_linked: current_user.hackatime_id.present?
    })

    totalProjectTime = current_user.total_reported_seconds
    inProgressTime = current_user.total_reported_seconds - current_user.total_ever_submitted_seconds
    reviewTime = current_user.total_in_review_seconds
    announcements = SlackAnnouncementsService.available? ? SlackAnnouncementsService.fetch_announcements : []
    referral_program = ReferralProgram.instance
    invite_item = Item.find_by(id: Item::INVITE_ID)
    boughtInvite = invite_item&.purchases&.where(user: current_user)&.exists? || false

    render inertia: { totalProjectTime:, inProgressTime:, reviewTime:, projectCount: current_user.projects.count, announcements: announcements, referralProgram: referral_program.active? ? { homepage_alert_title: referral_program.homepage_alert_title, homepage_alert_description: referral_program.homepage_alert_description } : nil, boughtInvite: }
  end

  def index
    referrer_name = nil
    ref_code = params[:r] || params[:ref] || session[:referral_code]
    if ref_code.present?
      referrer = find_referrer_by_code(ref_code)
      referrer_name = referrer&.username
    end

    render inertia: { signed_in: user_logged_in?, referrer_name: referrer_name }
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

    PostHog.capture({
      distinct_id: email,
      event: "signup_started",
      properties: { referral_code: session[:referral_code], platform: "web" }
    })

    if request.inertia?
      render inertia: "Redirect", props: { url: "/auth/start?email=" + email }
    else
      redirect_to "/auth/start"
    end
  end

  private

  def find_referrer_by_code(code)
    return nil if code.blank?

    User.where(is_banned: false).find_each do |u|
      return u if u.referral_link_code == code
    end
    nil
  end
end
