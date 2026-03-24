module OneTimeJobs
  class BackfillVerificationStatus < ApplicationJob
    queue_as :default

    def perform
      User.where.not(account_id: nil).find_each do |user|
        user.refresh_verification_status!
      end
    end
  end
end
