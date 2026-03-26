module Admin
  class ReferralsController < ApplicationController
    before_action :signed_in_admin
    skip_after_action :verify_authorized

    def index
      program = ReferralProgram.instance
      verified_users = User.where(verification_status: User.verified_verification_statuses).select(:id).to_sql

      leaderboard = User.joins(:referrals)
                        .select("users.id, users.username, users.avatar, COUNT(referrals.id) as referral_count, COALESCE(SUM(CASE WHEN referrals.referred_user_id IN (#{verified_users}) THEN 1 ELSE 0 END), 0) as verified_count, COALESCE(SUM(referrals.raffle_entries), 0) as total_raffle_entries")
                        .group("users.id, users.username, users.avatar")
                        .order("verified_count DESC, total_raffle_entries DESC, referral_count DESC, users.id ASC")
                        .limit(50)
                        .map do |u|
                          {
                            id: u.id,
                            username: u.username,
                            avatar: u.avatar,
                            referral_count: u.referral_count,
                            verified_count: u.verified_count,
                            total_raffle_entries: u.total_raffle_entries
                          }
                        end

      render inertia: "admin/referrals", props: {
        program: program.display_hash,
        items: Item.with_attached_image.order(:name).map(&:display_hash),
        leaderboard: leaderboard,
        stats: {
          total_referrals: Referral.count,
          verified_referrals: Referral.verified.count,
          total_raffle_entries: Referral.sum(:raffle_entries)
        }
      }
    end

    def update_program
      program = ReferralProgram.instance
      program.update!(program_params)

      redirect_to admin_referrals_path, notice: "Referral program settings updated."
    end

    def roll_raffle
      entries = User.joins(:referrals)
                    .where(referrals: { shipped: true })
                    .where("referrals.raffle_entries > 0")
                    .select("users.id, users.username, users.avatar, COALESCE(SUM(referrals.raffle_entries), 0) as total_entries")
                    .group("users.id, users.username, users.avatar")
                    .having("SUM(referrals.raffle_entries) > 0")

      if entries.empty?
        redirect_to admin_referrals_path, alert: "No raffle entries to pick from."
        return
      end

      total = entries.sum(&:total_entries)
      roll = rand(total)
      cumulative = 0
      winner = nil

      entries.each do |entry|
        cumulative += entry.total_entries
        if roll < cumulative
          winner = entry
          break
        end
      end

      chance = ((winner.total_entries.to_f / total) * 100).round(2)

      redirect_to admin_referrals_path, notice: "🎉 Raffle winner: #{winner.username || 'User #' + winner.id.to_s} — #{winner.total_entries} entries out of #{total} total (#{chance}% chance)"
    end

    private

    def program_params
      params.require(:referral_program).permit(
        :active, :referrer_raffle_entries, :referred_raffle_entries,
        :raffle_title, :raffle_description, :raffle_image_url,
        :homepage_alert_title, :homepage_alert_description, :invite_page_description,
        :referred_item_id, :og_description_template
      )
    end
  end
end
