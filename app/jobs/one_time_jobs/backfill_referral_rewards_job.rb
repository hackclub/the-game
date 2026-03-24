module OneTimeJobs
  class BackfillReferralRewardsJob < ApplicationJob
    queue_as :default

    def perform
      processed = 0
      errored = 0

      Rails.logger.info("[BackfillReferralRewardsJob] Starting backfill for #{Referral.count} referrals")

      Referral.includes(:referred_user).find_each do |referral|
        next unless referral.referred_user.present?

        referral.referred_user.refresh_verification_status!
        ReferralRewardService.sync_verification(referral.referred_user)
        processed += 1
        Rails.logger.info("[BackfillReferralRewardsJob] Synced referral #{referral.id} for user #{referral.referred_user_id} [#{processed} done]")
      rescue => e
        errored += 1
        Rails.logger.error("[BackfillReferralRewardsJob] Failed for referral #{referral.id}: #{e.class} - #{e.message}")
      end

      Rails.logger.info("[BackfillReferralRewardsJob] Done. processed=#{processed} errored=#{errored}")
    end
  end
end
