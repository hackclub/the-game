module OneTimeJobs
  class BackfillUserHandlesJob < ApplicationJob
    queue_as :default

    def perform
      processed = 0
      updated = 0
      errored = 0

      Rails.logger.info("[BackfillUserHandlesJob] Starting backfill for #{User.where.not(slack_id: [ nil, '' ]).count} users")

      User.where.not(slack_id: [ nil, "" ]).find_each do |user|
        username = User.fetch_username_from_slack(user.slack_id)

        if username.present? && user.username != username
          user.update_columns(username:, updated_at: Time.current)
          updated += 1
        end

        processed += 1
        Rails.logger.info("[BackfillUserHandlesJob] Synced user #{user.id} (#{processed} done, #{updated} updated)")
      rescue => e
        errored += 1
        Rails.logger.error("[BackfillUserHandlesJob] Failed for user #{user.id}: #{e.class} - #{e.message}")
      end

      Rails.logger.info("[BackfillUserHandlesJob] Done. processed=#{processed} updated=#{updated} errored=#{errored}")
    end
  end
end
