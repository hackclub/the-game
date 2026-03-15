module Admin
  class ReferralsController < ApplicationController
    before_action :signed_in_admin
    skip_after_action :verify_authorized

    def index
      program = ReferralProgram.instance

      leaderboard = User.where(referral_eligible: true)
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

      render inertia: "admin/referrals", props: {
        program: program.display_hash,
        leaderboard: leaderboard,
        stats: {
          total_eligible_users: User.where(referral_eligible: true).count,
          total_referrals: Referral.count,
          shipped_referrals: Referral.shipped.count,
          total_tickets_awarded: Referral.sum(:tickets_awarded)
        }
      }
    end

    def update_program
      program = ReferralProgram.instance
      program.update!(program_params)

      redirect_to admin_referrals_path, notice: "Referral program settings updated."
    end

    def start_rollout
      program = ReferralProgram.instance
      program.update!(rollout_status: "running")
      ReferralRolloutJob.perform_later

      redirect_to admin_referrals_path, notice: "Rollout started!"
    end

    def pause_rollout
      program = ReferralProgram.instance
      program.update!(rollout_status: "paused")

      redirect_to admin_referrals_path, notice: "Rollout paused."
    end

    private

    def program_params
      params.require(:referral_program).permit(
        :referrer_bonus_percentage, :referred_bonus_tickets,
        :max_referrers, :rollout_batch_size, :rollout_interval_hours,
        :slack_message_template
      )
    end
  end
end
