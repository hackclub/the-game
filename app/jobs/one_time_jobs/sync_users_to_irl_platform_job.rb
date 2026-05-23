module OneTimeJobs
  class SyncUsersToIrlPlatformJob < ApplicationJob
    BATCH_SIZE = 100

    queue_as :default

    def perform
      stub_ids = PlatformAuthorizationService.stub_hca_ids
      Rails.logger.info("[SyncUsersToIrlPlatformJob] #{stub_ids.size} stub users need data")

      users = User.where(account_id: stub_ids)
      Rails.logger.info("[SyncUsersToIrlPlatformJob] #{users.count} matched in the-game")

      synced = 0
      errored = 0

      users.find_in_batches(batch_size: BATCH_SIZE) do |batch|
        PlatformAuthorizationService.authorize_batch!(batch)
        synced += batch.size
        Rails.logger.info("[SyncUsersToIrlPlatformJob] Synced #{synced}/#{users.count}")
      rescue => e
        errored += batch.size
        Rails.logger.error("[SyncUsersToIrlPlatformJob] Batch failed: #{e.class} - #{e.message}")
      end

      Rails.logger.info("[SyncUsersToIrlPlatformJob] Done. synced=#{synced} errored=#{errored}")
    end
  end
end
