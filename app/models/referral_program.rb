class ReferralProgram < ApplicationRecord
  self.table_name = "referral_program"

  validates :referrer_bonus_percentage, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  validates :referred_bonus_tickets, numericality: { greater_than: 0 }
  validates :rollout_status, inclusion: { in: %w[paused running completed] }

  def self.instance
    first_or_create!(
      referrer_bonus_percentage: 10,
      referred_bonus_tickets: 5,
      max_referrers: 100,
      rollout_batch_size: 10,
      rollout_interval_hours: 24,
      slack_message_template: "Hey {{user}}! You can now *invite people to Hack Club: The Game* and get free tickets! For each person that you invite that ships a project, you'll get {{bonus_tickets}} tickets. Here's your invite link: {{link}}"
    )
  end

  def display_hash
    as_json.except("created_at", "updated_at")
  end
end
