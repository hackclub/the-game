class Referral < ApplicationRecord
  belongs_to :referrer, class_name: "User"
  belongs_to :referred_user, class_name: "User"

  validates :code, presence: true
  validates :referred_user_id, uniqueness: true

  scope :shipped, -> { where(shipped: true) }

  def display_hash
    hash = as_json.slice("id", "code", "raffle_entries", "shipped", "created_at")
    hash["referred_user"] = referred_user.display_hash
    hash
  end
end
