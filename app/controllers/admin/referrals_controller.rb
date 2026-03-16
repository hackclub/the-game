module Admin
  class ReferralsController < ApplicationController
    before_action :signed_in_admin
    skip_after_action :verify_authorized

    def index
      program = ReferralProgram.instance

      leaderboard = User.joins(:referrals)
                        .select("users.id, users.username, users.avatar, COUNT(referrals.id) as referral_count, COALESCE(SUM(CASE WHEN referrals.shipped THEN 1 ELSE 0 END), 0) as shipped_count, COALESCE(SUM(referrals.raffle_entries), 0) as total_raffle_entries")
                        .group("users.id, users.username, users.avatar")
                        .order("total_raffle_entries DESC")
                        .limit(50)
                        .map do |u|
                          {
                            id: u.id,
                            username: u.username,
                            avatar: u.avatar,
                            referral_count: u.referral_count,
                            shipped_count: u.shipped_count,
                            total_raffle_entries: u.total_raffle_entries
                          }
                        end

      render inertia: "admin/referrals", props: {
        program: program.display_hash,
        leaderboard: leaderboard,
        stats: {
          total_referrals: Referral.count,
          shipped_referrals: Referral.shipped.count,
          total_raffle_entries: Referral.sum(:raffle_entries)
        }
      }
    end

    def update_program
      program = ReferralProgram.instance
      program.update!(program_params)

      redirect_to admin_referrals_path, notice: "Referral program settings updated."
    end

    private

    def program_params
      params.require(:referral_program).permit(
        :active, :referrer_raffle_entries, :referred_raffle_entries,
        :raffle_title, :raffle_description, :raffle_image_url,
        :homepage_alert_title, :homepage_alert_description, :invite_page_description
      )
    end
  end
end
