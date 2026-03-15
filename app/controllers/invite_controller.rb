class InviteController < ApplicationController
  allow_unauthenticated_access only: [ :show ]
  skip_after_action :verify_authorized

  def index
    unless current_user&.referral_eligible?
      redirect_to home_path, alert: "You're not eligible for the referral program yet."
      return
    end

    program = ReferralProgram.instance
    my_referrals = current_user.referrals.includes(:referred_user).order(created_at: :desc)

    render inertia: "invite/index", props: {
      referral_code: current_user.referral_link_code,
      referral_link: root_url(ref: current_user.referral_link_code),
      referrals: my_referrals.map(&:display_hash),
      leaderboard: referral_leaderboard,
      referrer_bonus_percentage: program.referrer_bonus_percentage,
      referred_bonus_tickets: program.referred_bonus_tickets,
      stats: {
        total_referrals: my_referrals.count,
        shipped_referrals: my_referrals.shipped.count,
        total_tickets_earned: my_referrals.sum(:tickets_awarded)
      }
    }
  end

  def show
    code = params[:code]
    referrer = find_referrer_by_code(code)

    if referrer
      @og_title = "#{referrer.username || 'Someone'} invited you to Hack Club: The Game!"
      @og_description = "Join Hack Club: The Game and earn #{ReferralProgram.instance.referred_bonus_tickets} bonus tickets when you ship your first project!"
    end

    redirect_to root_path(ref: code)
  end

  private

  def find_referrer_by_code(code)
    return nil if code.blank?

    User.where(referral_eligible: true).find_each do |u|
      return u if u.referral_link_code == code
    end
    nil
  end

  def referral_leaderboard
    User.where(referral_eligible: true)
        .joins(:referrals)
        .select("users.id, users.username, users.avatar, COUNT(referrals.id) as referral_count, COALESCE(SUM(CASE WHEN referrals.shipped THEN 1 ELSE 0 END), 0) as shipped_count, COALESCE(SUM(referrals.tickets_awarded), 0) as total_tickets")
        .group("users.id, users.username, users.avatar")
        .order("total_tickets DESC")
        .limit(50)
        .map do |u|
          {
            id: u.id,
            username: u.username,
            avatar: u.avatar,
            referral_count: u.referral_count,
            shipped_count: u.shipped_count,
            total_tickets: u.total_tickets
          }
        end
  end
end
