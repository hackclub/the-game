# == Schema Information
#
# Table name: daily_active_users
#
#  id         :bigint           not null, primary key
#  date       :date             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_daily_active_users_on_user_id_and_date  (user_id, date) UNIQUE
#
class DailyActiveUser < ApplicationRecord
  belongs_to :user
end
