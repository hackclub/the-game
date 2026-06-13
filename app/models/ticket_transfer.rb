# == Schema Information
#
# Table name: ticket_transfers
#
#  id           :bigint           not null, primary key
#  aasm_state   :string           not null
#  amount       :integer          not null
#  approved_at  :datetime
#  reason       :string           not null
#  rejected_at  :datetime
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
  include AASM

  has_paper_trail

  belongs_to :from_user, class_name: "User"
  belongs_to :to_user, class_name: "User"
  has_many :notifications, as: :notifiable, dependent: :destroy

  validates :amount, comparison: { greater_than: 0 }
  validate :is_not_self_transfer
  validate :check_balance, if: -> { amount_changed? }

  scope :not_rejected, -> { where.not(aasm_state: "rejected") }

  aasm do
    state :pending, initial: true
    state :approved
    state :rejected

    event :mark_approved do
      transitions from: :pending, to: :approved

      after do
        Notification.create!(user: from_user, notifiable: self, message: "Your transfer of #{pluralize(amount, "ticket")} to #{to_user.username} was approved!", link: Rails.application.routes.url_helpers.me_url)
        Notification.create!(user: to_user, notifiable: self, message: "#{from_user.username} has transferred #{pluralize(amount, "ticket")} to you!", link: Rails.application.routes.url_helpers.me_url)
      end
    end

    event :mark_rejected do
      transitions from: :pending, to: :rejected

      after do
        Notification.create!(user: from_user, notifiable: self, message: "Your transfer of #{pluralize(amount, "ticket")} to #{to_user.username} was rejected", link: Rails.application.routes.url_helpers.me_url)
      end
    end
  end

  def display_hash(private: false)
    hash = self.as_json.slice("id", "amount", "reason", "aasm_state", "created_at", "approved_at", "rejected_at")

    hash["from_user_name"] = from_user.username
    hash["to_user_name"] = to_user.username

    if private
      hash["from_user_id"] = from_user_id
      hash["to_user_id"] = to_user_id
    end

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
