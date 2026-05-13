namespace :platform do
  desc "Grant Platform access to users who already have a fulfilled purchase of a grants_platform_access item"
  task backfill_access: :environment do
    unless ENV["PLATFORM_API_URL"].present? && ENV["PLATFORM_API_TOKEN"].present?
      puts "ERROR: PLATFORM_API_URL and PLATFORM_API_TOKEN must be set."
      exit 1
    end

    purchases = Item::Purchase
      .fulfilled
      .joins(:item)
      .where(items: { grants_platform_access: true })
      .includes(:user)

    total = purchases.count
    puts "Processing #{total} fulfilled purchases..."

    succeeded = 0
    skipped   = 0
    errored   = 0

    purchases.find_each.with_index(1) do |purchase, i|
      user = purchase.user
      print "[#{i}/#{total}] User ##{user.id} (#{user.email}) — purchase ##{purchase.id}... "

      if user.account_id.blank?
        puts "skipped (no HCA account_id)"
        skipped += 1
        next
      end

      result = PlatformAuthorizationService.authorize!(user.account_id)
      puts result["already_authorized"] ? "already authorized" : "granted"
      succeeded += 1
    rescue => e
      puts "ERROR: #{e.message}"
      errored += 1
    end

    puts "\nFinished. #{succeeded} authorized, #{skipped} skipped, #{errored} errored."
  end
end
