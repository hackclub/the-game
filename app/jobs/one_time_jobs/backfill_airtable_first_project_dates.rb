module OneTimeJobs
  class BackfillAirtableFirstProjectDates < ApplicationJob
    queue_as :default

    def perform
      processed = 0
      errored = 0

      Rails.logger.info("[BackfillAirtableFirstProjectDates] Starting backfill for #{User.count} users")

      User.find_each do |user|
        user.sync_airtable_record
        processed += 1
        Rails.logger.info("[BackfillAirtableFirstProjectDates] Synced user #{user.id} (#{user.email}) [#{processed} done]")
      rescue => e
        errored += 1
        Rails.logger.error("[BackfillAirtableFirstProjectDates] Failed for user #{user.id} (#{user.email}): #{e.class} - #{e.message}")
      end

      Rails.logger.info("[BackfillAirtableFirstProjectDates] Done. processed=#{processed} errored=#{errored}")
    end
  end
end
