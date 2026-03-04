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
  has_paper_trail

  belongs_to :user, required: true

  validate :nonzero_amount

  after_create_commit :create_notification

  def display_hash
    self.as_json.slice("id", "amount", "reason", "created_at")
  end

  private

  def nonzero_amount
    if amount == 0
      errors.add(:amount, "cannot be zero")
    end
  end

  def create_notification
    message = if amount > 0
      "You have been awarded #{amount} extra #{"ticket".pluralize(amount)} for \"#{reason}\"!"
    else
      "You have been deducted #{amount} tickets for \"#{reason}\"."
    end

    Notification.create!(user:, notifiable: self, message:, link: Rails.application.routes.url_helpers.me_url)
  end
end
