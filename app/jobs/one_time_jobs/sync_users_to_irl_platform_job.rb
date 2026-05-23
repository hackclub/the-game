module OneTimeJobs
  class SyncUsersToIrlPlatformJob < ApplicationJob
    queue_as :default

    def perform
      users = User.where.not(account_id: [ nil, "" ])
      synced = 0
      errored = 0

      Rails.logger.info("[SyncUsersToIrlPlatformJob] Starting sync for #{users.count} users")

      users.find_each do |user|
        PlatformAuthorizationService.authorize!(user)
        synced += 1
        Rails.logger.info("[SyncUsersToIrlPlatformJob] Synced user #{user.id} / #{user.account_id} (#{synced} done)")
      rescue => e
        errored += 1
        Rails.logger.error("[SyncUsersToIrlPlatformJob] Failed for user #{user.id}: #{e.class} - #{e.message}")
      end

      Rails.logger.info("[SyncUsersToIrlPlatformJob] Done. synced=#{synced} errored=#{errored}")
    end
  end
end
