namespace :platform do
  desc "Grant Platform access to users who already have a fulfilled purchase of a grants_platform_access item, or a pending invite purchase"
  task backfill_access: :environment do
    unless ENV["PLATFORM_API_URL"].present? && ENV["PLATFORM_API_TOKEN"].present?
      puts "ERROR: PLATFORM_API_URL and PLATFORM_API_TOKEN must be set."
      exit 1
    end

    fulfilled_purchases = Item::Purchase
      .fulfilled
      .joins(:item)
      .where(items: { grants_platform_access: true })
      .includes(:user)

    pending_invites = Item::Purchase
      .pending
      .where(item_id: Item::INVITE_ID)
      .includes(:user)

    user_ids_seen = Set.new
    purchases = (fulfilled_purchases.to_a + pending_invites.to_a).select { |p| user_ids_seen.add?(p.user_id) }

    total = purchases.count
    puts "Processing #{total} purchases (fulfilled platform-access + pending invites, deduplicated)..."

    succeeded = 0
    skipped   = 0
    errored   = 0

    purchases.each_with_index do |purchase, i|
      user = purchase.user
      print "[#{i + 1}/#{total}] User ##{user.id} (#{user.email}) — purchase ##{purchase.id}... "

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
