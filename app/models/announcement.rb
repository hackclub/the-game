# == Schema Information
#
# Table name: announcements
#
#  id         :bigint           not null, primary key
#  content    :text
#  deleted_at :datetime
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_announcements_on_user_id  (user_id)
#
class Announcement < ApplicationRecord
  acts_as_paranoid

  belongs_to :user

  def display_hash
    self.as_json.slice("id", "title", "content", "created_at")
  end
end
