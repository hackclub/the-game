# == Schema Information
#
# Table name: item_purchases
#
#  id           :bigint           not null, primary key
#  aasm_state   :string           default("pending"), not null
#  admin_note   :text
#  amount_paid  :integer          not null
#  deleted_at   :datetime
#  fulfilled_at :datetime
#  hold_at      :datetime
#  note         :text
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
    acts_as_paranoid

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

    attr_accessor :skip_balance_check

    before_validation :set_amount_paid

    validates :quantity, numericality: { greater_than: 0 }
    validate :user_is_verified, on: :create
    validate :check_balance, on: :create, unless: :skip_balance_check
    validate :check_one_per_user, on: :create
    validate :check_black_market, on: :create

    def display_hash(item: false, admin: false)
      hash = self.as_json.slice("id", "aasm_state", "created_at", "updated_at", "item_id", "user_id", "fulfilled_at", "hold_at", "quantity", "deleted_at", "amount_paid", "note")

      if item
        hash["item"] = self.item.display_hash
      end

      if admin
        hash["admin_note"] = self.admin_note
      end

      hash
    end

    private

    def set_amount_paid
      self.amount_paid = (quantity || 1) * item.price
    end

    def user_is_verified
      return if user.idv_verified?

      errors.add(:base, "User ##{user.id} must complete ID verification before purchasing shop items")
    end

    def check_balance
      if user.balance < amount_paid
        errors.add(:base, "User ##{user.id} (#{user.balance} tickets) does not have sufficient tickets to purchase #{quantity}x #{item.name} (#{amount_paid} tickets)")
      end
    end

    def check_one_per_user
      return unless item.one_per_user? && self.class.where(user: user, item: item).exists?

      errors.add(:base, "You have already purchased #{item.name}")
    end

    def check_black_market
      if item.black_market && !user.wizard?
        errors.add(:base, "A golden ticket is required to purchase this item")
      end
    end
  end
end
