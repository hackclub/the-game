class InviteController < ApplicationController
  allow_unauthenticated_access only: [ :show ]
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
      referral_link: root_url(ref: current_user.referral_link_code),
      referrals: my_referrals.map(&:display_hash),
      leaderboard: referral_leaderboard,
      program: program.display_hash,
      stats: {
        total_referrals: my_referrals.count,
        shipped_referrals: my_referrals.shipped.count,
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

    redirect_to root_path(ref: code)
  end

  private

  def find_referrer_by_code(code)
    return nil if code.blank?

    User.where(is_banned: false).find_each do |u|
      return u if u.referral_link_code == code
    end
    nil
  end

  def referral_leaderboard
    User.joins(:referrals)
        .select("users.id, users.username, users.avatar, COUNT(referrals.id) as referral_count, COALESCE(SUM(CASE WHEN referrals.shipped THEN 1 ELSE 0 END), 0) as shipped_count, COALESCE(SUM(referrals.raffle_entries), 0) as total_entries")
        .group("users.id, users.username, users.avatar")
        .order("total_entries DESC")
        .limit(50)
        .map do |u|
          {
            id: u.id,
            username: u.username,
            avatar: u.avatar,
            referral_count: u.referral_count,
            shipped_count: u.shipped_count,
            total_entries: u.total_entries
          }
        end
  end
end
