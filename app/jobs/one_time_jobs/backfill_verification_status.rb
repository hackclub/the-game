module OneTimeJobs
  class BackfillVerificationStatus < ApplicationJob
    queue_as :default

    def perform
      User.where.not(account_access_token: nil).each do |user|
        account_info = User.account_user_info(user.account_access_token)

        if account_info.present?
          user.update!(verification_status: account_info["verification_status"])
        end
      end
    end
  end
end
