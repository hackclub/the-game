# == Schema Information
#
# Table name: item_purchases
#
#  id         :bigint           not null, primary key
#  aasm_state :string           default("pending"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  item_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_item_purchases_on_item_id  (item_id)
#  index_item_purchases_on_user_id  (user_id)
#
class Item
  class Purchase < ApplicationRecord
    include AASM

    belongs_to :user
    belongs_to :item

    aasm do
      state :pending, initial: true
      state :processing
      state :fulfilled
      state :cancelled

      event :process do
        transitions from: :pending, to: :fulfill
      end

      event :fulfill do
        transitions from: :pending, to: :fulfilled
      end

      event :cancel do
        transitions from: [:pending, :processing], to: :cancelled
      end
    end

    has_paper_trail

    
    validate :check_balance, on: :create



    private

   

    def check_balance
      if user.balance < item.price
        errors.add(:base, "User ##{user.id} (#{user.balance} tickets) does not have sufficient tickets to purchase #{item.name} (#{item.price} tickets)")
      end
    end
  end
end
