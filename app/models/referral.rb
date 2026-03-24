# == Schema Information
#
# Table name: referrals
#
#  id               :bigint           not null, primary key
#  code             :string           not null
#  raffle_entries   :integer          default(0)
#  shipped          :boolean          default(FALSE)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  referred_user_id :bigint           not null
#  referrer_id      :bigint           not null
#
# Indexes
#
#  index_referrals_on_code              (code)
#  index_referrals_on_referred_user_id  (referred_user_id) UNIQUE
#  index_referrals_on_referrer_id       (referrer_id)
#
# Foreign Keys
#
#  fk_rails_...  (referred_user_id => users.id)
#  fk_rails_...  (referrer_id => users.id)
#
class Referral < ApplicationRecord
  belongs_to :referrer, class_name: "User"
  belongs_to :referred_user, class_name: "User"

  validates :code, presence: true
  validates :referred_user_id, uniqueness: true

  scope :shipped, -> { where(shipped: true) }
  scope :verified, -> { where(referred_user_id: User.where(verification_status: "verified").select(:id)) }

  def verified?
    referred_user&.idv_verified? || false
  end

  def display_hash
    hash = as_json.slice("id", "code", "raffle_entries", "created_at")
    hash["verified"] = verified?
    hash["referred_user"] = referred_user.display_hash
    hash
  end
end
