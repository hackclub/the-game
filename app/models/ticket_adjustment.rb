# == Schema Information
#
# Table name: ticket_adjustments
#
#  id         :bigint           not null, primary key
#  amount     :integer          not null
#  reason     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_ticket_adjustments_on_user_id  (user_id)
#
class TicketAdjustment < ApplicationRecord
  belongs_to :user, required: true

  validate :nonzero_amount

  def display_hash
    self.as_json.slice("id", "amount", "reason", "created_at")
  end

  private

  def nonzero_amount
    if amount == 0
      errors.add(:amount, "cannot be zero")
    end
  end
end
