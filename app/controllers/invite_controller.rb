class InviteController < ApplicationController
  allow_unauthenticated_access only: [ :show ]
  before_action :signed_in_admin, only: [ :index ]
  skip_after_action :verify_authorized

  def index
    program = ReferralProgram.instance

    unless program.active?
      redirect_to home_path, alert: "The referral program is not active right now."
      return
    end

    my_referrals = current_user.referrals.includes(:referred_user).order(created_at: :desc)

    render inertia: "invite/index", props: {
      referral_code: current_user.referral_link_code,
      referral_link: root_url(r: current_user.referral_link_code),
      referrals: my_referrals.map(&:display_hash),
      leaderboard: referral_leaderboard,
      program: program.display_hash,
      stats: {
        total_referrals: my_referrals.count,
        verified_referrals: my_referrals.verified.count,
        total_raffle_entries: my_referrals.sum(:raffle_entries)
      }
    }
  end

  def show
    code = params[:code]
    referrer = find_referrer_by_code(code)

    if referrer
      program = ReferralProgram.instance
      @og_title = "#{referrer.username || 'Someone'} invited you to Hack Club: The Game!"
      @og_description = program.og_description_for(referrer)
    end

    redirect_to root_path(r: code)
  end

  private

  def find_referrer_by_code(code)
    return nil if code.blank?

    User.find_by(referral_share_code: code, is_banned: false)
  end

  def referral_leaderboard
    verified_users = User.where(verification_status: User.verified_verification_statuses).select(:id).to_sql

    User.joins(:referrals)
        .select("users.id, users.username, users.avatar, COUNT(referrals.id) as referral_count, COALESCE(SUM(CASE WHEN referrals.referred_user_id IN (#{verified_users}) THEN 1 ELSE 0 END), 0) as verified_count, COALESCE(SUM(referrals.raffle_entries), 0) as total_entries")
        .group("users.id, users.username, users.avatar")
        .order("verified_count DESC, total_entries DESC, referral_count DESC, users.id ASC")
        .limit(50)
        .map do |u|
          {
            id: u.id,
            username: u.username,
            avatar: u.avatar,
            referral_count: u.referral_count,
            verified_count: u.verified_count,
            total_entries: u.total_entries
          }
        end
  end
end
