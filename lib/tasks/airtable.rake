namespace :airtable do
  desc "Backfill hours_logged for all users in Airtable"
  task backfill_hours_logged: :environment do
    unless User::Airtable.airtable_enabled?
      puts "ERROR: Airtable is not configured (missing AIRTABLE_API_KEY)."
      exit 1
    end

    total = User.count
    processed = 0
    errored = 0

    puts "Backfilling hours_logged for #{total} users..."

    User.find_each.with_index(1) do |user, i|
      print "[#{i}/#{total}] #{user.email}... "
      user.sync_airtable_record
      processed += 1
      puts "done (#{(user.total_reported_seconds / 3600.0).round(2)}h)"
    rescue => e
      errored += 1
      puts "ERROR: #{e.class} - #{e.message}"
    end

    puts "\nFinished. #{processed} synced, #{errored} errored."
  end
end
