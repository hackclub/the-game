namespace :slack do
  desc "Invite all existing users with a slack_id to the game's Slack channels. Set JOIN_AFTER=YYYY-MM-DD to only include users who joined after that date."
  task invite_existing_users: :environment do
    unless SlackChannelInviteService.available?
      puts "ERROR: SLACK_XOXD_TOKEN and SLACK_XOXC_TOKEN must be set."
      exit 1
    end

    users = User.where.not(slack_id: [ nil, "" ])

    if ENV["JOIN_AFTER"].present?
      join_after = Date.parse(ENV["JOIN_AFTER"])
      users = users.where("created_at > ?", join_after)
      puts "Filtering to users who joined after #{join_after}..."
    end
    total = users.count
    puts "Processing #{total} users..."

    succeeded = 0
    skipped = 0

    users.find_each.with_index(1) do |user, i|
      print "[#{i}/#{total}] #{user.email} (#{user.slack_id})... "
      SlackChannelInviteService.invite_user(user.slack_id)
      puts "done"
      succeeded += 1
      sleep(1) # stay well under Slack Tier 3 rate limits (3 calls/user)
    rescue => e
      puts "ERROR: #{e.message}"
      skipped += 1
    end

    puts "\nFinished. #{succeeded} processed, #{skipped} errored."
  end
end
