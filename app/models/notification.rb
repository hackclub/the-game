# == Schema Information
#
# Table name: notifications
#
#  id              :bigint           not null, primary key
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

  after_create_commit :send

  def send
    # send to slack
  end
end
