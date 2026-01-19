module OneTimeJobs
  class ImportAirtableRsvpsJob < ApplicationJob
    queue_as :default

    def perform
      rsvps = AirtableService.new.get_rsvps

      rsvps.each do |rsvp|
        User.create(email: rsvp["fields"]["email"]) rescue PG::UniqueViolation
      end
    end
  end
end
