# == Schema Information
#
# Table name: notifications
#
#  id              :bigint           not null, primary key
#  link            :string
#  message         :string           not null
#  notifiable_type :string           not null
#  read            :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  notifiable_id   :bigint           not null
#  user_id         :bigint           not null
#
# Indexes
#
#  index_notifications_on_notifiable  (notifiable_type,notifiable_id)
#  index_notifications_on_user_id     (user_id)
#
class Notification < ApplicationRecord
  belongs_to :user, required: true
  belongs_to :notifiable, polymorphic: true, required: true

  scope :unread, -> { where(read: false) }

  validate :unqiue_notification, if: -> { notifiable_changed? || message_changed? }

  after_create_commit :notify_slack

  def display_hash(notifiable: false)
    hash = self.as_json.slice("id", "message", "notifiable_type", "notifiable_id", "read", "created_at")

    if notifiable
      hash["notifiable"] = self.notifiable.display_hash
    end

    hash
  end

  def mark_read
    update!(read: true)
  end

  private

  def notify_slack
    return if user.slack_id.nil?

    client = Slack::Web::Client.new

    message_with_link = "#{message}\n#{"<#{link}|Open project on the platform>" if link.present?}"
    client.chat_postMessage(channel: user.slack_id, text: message_with_link)
  end

  def unqiue_notification
    if Notification.where(notifiable:, message:).exists?
      errors.add(:base, "This notification already exists")
    end
  end
end
