# == Schema Information
#
# Table name: referral_program
#
#  id                         :bigint           not null, primary key
#  active                     :boolean          default(FALSE)
#  homepage_alert_description :text
#  homepage_alert_title       :string
#  invite_page_description    :text
#  og_description_template    :text
#  raffle_description         :text
#  raffle_image_url           :string
#  raffle_title               :string
#  referred_raffle_entries    :integer          default(1)
#  referrer_raffle_entries    :integer          default(1)
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  referred_item_id           :bigint
#
# Foreign Keys
#
#  fk_rails_...  (referred_item_id => items.id)
#
class ReferralProgram < ApplicationRecord
  self.table_name = "referral_program"

  belongs_to :referred_item, class_name: "Item", optional: true

  validates :referrer_raffle_entries, numericality: { greater_than: 0 }

  def self.instance
    first_or_create!(
      active: false,
      referrer_raffle_entries: 1,
      referred_raffle_entries: 1,
      raffle_title: "Referral Raffle",
      raffle_description: "Invite friends and earn raffle entries!",
      homepage_alert_title: "🎟️ Invite your friends!",
      homepage_alert_description: "Share your referral link and earn raffle entries for prizes!",
      invite_page_description: "Share your link and earn raffle entries! When someone you invite verifies with Hack Club Auth, you'll earn entries into the raffle.",
      og_description_template: "<USER> invited you to Hack Club: The Game! Join and get free stickers!"
    )
  end

  def og_description_for(referrer)
    template = og_description_template.presence || "<USER> invited you to Hack Club: The Game!"
    template.gsub("<USER>", referrer.username || "Someone")
  end

  def display_hash
    hash = as_json.except("created_at", "updated_at")
    if referred_item.present?
      hash["referred_item"] = referred_item.display_hash
    end
    hash
  end
end
