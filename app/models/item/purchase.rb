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
#  reference    :text
#  user_note    :text
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
        after { grant_platform_access_if_applicable }
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
    validate :check_stock, on: :create

    def notify_fulfillment!
      return unless user.slack_id.present?

      mailed = reference&.start_with?("https://mail.hackclub.com")
      if mailed
        SlackApiService.post_message(
          channel: user.slack_id,
          text: "Hey #{user.username}! Your order for \"#{item.name}\" has been mailed out! <#{reference}|Track it here.>"
        )
      else
        grant = reference&.start_with?("https://hcb.hackclub.com/grants/")
        parts = []
        parts << "<#{reference}|Use it here!>" if grant
        parts << (user_note.present? ? "Here's a note from the team: #{user_note}" : ("Enjoy!" unless grant))
        suffix = parts.compact.join(" ")
        SlackApiService.post_message(
          channel: user.slack_id,
          text: "Hey #{user.username}! Your order for \"#{item.name}\" has been fulfilled. #{suffix}"
        )
      end
    end

    def display_hash(item: false, admin: false)
      hash = self.as_json.slice("id", "aasm_state", "created_at", "updated_at", "item_id", "user_id", "fulfilled_at", "hold_at", "quantity", "deleted_at", "amount_paid", "note")

      if item
        hash["item"] = self.item.display_hash
      end

      if admin
        hash["admin_note"] = self.admin_note
        hash["user_note"] = self.user_note
      end

      hash
    end

    private

    def set_amount_paid
      if amount_paid.nil?
        self.amount_paid = (quantity || 1) * item.price_for(user)
      end
    end

    def user_is_verified
      return if user.idv_verified?

      errors.add(:base, "User ##{user.id} must complete ID verification before purchasing shop items")
    end

    def check_balance
      if user.can_overspend? && item.event_related?
        if item.id == Item::INVITE_ID && user.balance < 20
          errors.add(:base, "You need at least 20 tickets to purchase #{item.name}")
        end
        return
      end
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

    def check_stock
      return unless item.stock.present?

      available = item.stock - item.purchases.sum(:quantity)
      if quantity > available
        errors.add(:base, "#{item.name} is out of stock")
      end
    end

    def grant_platform_access_if_applicable
      return unless item.grants_platform_access?
      return if user.account_id.blank?

      PlatformAuthorizationService.authorize!(user)
    rescue => e
      Rails.logger.error("[PlatformAuthorizationService] Failed to authorize user #{user.id} for purchase #{id}: #{e.message}")
    end
  end
end
