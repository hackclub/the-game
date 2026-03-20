module OneTimeJobs
  class BackfillAirtableFirstProjectDates < ApplicationJob
    queue_as :default

    def perform
      User.find_each do |user|
        user.sync_airtable_record
      end
    end
  end
end
