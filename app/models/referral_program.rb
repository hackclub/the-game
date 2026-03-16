class ReferralProgram < ApplicationRecord
  self.table_name = "referral_program"

  validates :referrer_raffle_entries, numericality: { greater_than: 0 }
  validates :referred_raffle_entries, numericality: { greater_than: 0 }

  def self.instance
    first_or_create!(
      active: false,
      referrer_raffle_entries: 1,
      referred_raffle_entries: 1,
      raffle_title: "Referral Raffle",
      raffle_description: "Invite friends and earn raffle entries!",
      homepage_alert_title: "🎟️ Invite your friends!",
      homepage_alert_description: "Share your referral link and earn raffle entries for prizes!",
      invite_page_description: "Share your link and earn raffle entries! For each person you invite that ships a project, you'll both earn entries into the raffle."
    )
  end

  def display_hash
    as_json.except("created_at", "updated_at")
  end
end
