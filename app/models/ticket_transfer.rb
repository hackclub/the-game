# == Schema Information
#
# Table name: ticket_transfers
#
#  id           :bigint           not null, primary key
#  amount       :integer          not null
#  reason       :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  from_user_id :bigint           not null
#  to_user_id   :bigint           not null
#
# Indexes
#
#  index_ticket_transfers_on_from_user_id  (from_user_id)
#  index_ticket_transfers_on_to_user_id    (to_user_id)
#
class TicketTransfer < ApplicationRecord
  include ActionView::Helpers::TextHelper

  belongs_to :from_user, class_name: "User"
  belongs_to :to_user, class_name: "User"

  validates :amount, comparison: { greater_than: 0 }
  validate :is_not_self_transfer
  validate :check_balance

  def display_hash
    hash = self.as_json.slice("id", "amount", "reason", "created_at")

    hash["from_user_name"] = from_user.username
    hash["to_user_name"] = to_user.username

    hash
  end

  private

  def is_not_self_transfer
    if from_user == to_user
      errors.add(:base, "You can't transfer tickets to yourself!")
    end
  end

  def check_balance
    if from_user.balance < amount
      errors.add(:base, "User ##{from_user.id} (#{from_user.balance} tickets) does not have sufficient tickets to transfer #{pluralize(amount, "ticket")}")
    end
  end
end
