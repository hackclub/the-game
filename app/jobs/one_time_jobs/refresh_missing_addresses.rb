module OneTimeJobs
  class RefreshMissingAddresses < ApplicationJob
    queue_as :default

    def perform
      # Only target users who are verified but missing one or more address fields
      # These users bypass the automatic refresh in ApplicationController because they are already verified
      users = User.where(verification_status: User::VERIFIED_VERIFICATION_STATUSES)
                  .where.not(account_id: nil)
                  .where(
                    "address_street IS NULL OR address_street = '' OR " \
                    "address_locality IS NULL OR address_locality = '' OR " \
                    "address_region IS NULL OR address_region = '' OR " \
                    "address_country IS NULL OR address_country = '' OR " \
                    "address_postal IS NULL OR address_postal = ''"
                  )

      processed = 0
      errored = 0

      Rails.logger.info("[RefreshMissingAddresses] Starting refresh for #{users.count} users")

      users.find_each do |user|
        user.refresh_verification_status!
        processed += 1
        Rails.logger.info("[RefreshMissingAddresses] Refreshed address for user #{user.id} (#{user.email}) [#{processed} done]")
      rescue => e
        errored += 1
        Rails.logger.error("[RefreshMissingAddresses] Failed for user #{user.id} (#{user.email}): #{e.class} - #{e.message}")
      end

      Rails.logger.info("[RefreshMissingAddresses] Done. processed=#{processed} errored=#{errored}")
    end
  end
end
