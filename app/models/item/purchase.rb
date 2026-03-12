# == Schema Information
#
# Table name: item_purchases
#
#  id           :bigint           not null, primary key
#  aasm_state   :string           default("pending"), not null
#  fulfilled_at :datetime
#  hold_at      :datetime
#  quantity     :integer          default(1), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  item_id      :bigint           not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_item_purchases_on_item_id  (item_id)
#  index_item_purchases_on_user_id  (user_id)
#
class Item
  class Purchase < ApplicationRecord
    include AASM
    has_paper_trail

    belongs_to :user
    belongs_to :item

    aasm timestamps: true do
      state :pending, initial: true
      state :fulfilled
      state :hold

      event :fulfill do
        transitions from: [ :pending, :hold ], to: :fulfilled
      end

      event :hold do
        transitions from: [ :pending, :processing, :fulfilled ], to: :hold
      end
    end

    validates :quantity, numericality: { greater_than: 0 }
    validate :check_balance, on: :create

    def display_hash(item: false)
      hash = self.as_json.slice("id", "aasm_state", "created_at", "updated_at", "item_id", "user_id", "fulfilled_at", "hold_at", "quantity")

      if item
        hash["item"] = self.item.display_hash
      end

      hash
    end

    private

    def check_balance
      total_cost = item.price * quantity
      if user.balance < total_cost
        errors.add(:base, "User ##{user.id} (#{user.balance} tickets) does not have sufficient tickets to purchase #{quantity}x #{item.name} (#{total_cost} tickets)")
      end
    end
  end
end
