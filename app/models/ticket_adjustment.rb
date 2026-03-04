# == Schema Information
#
# Table name: ticket_adjustments
#
#  id         :bigint           not null, primary key
#  amount     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_ticket_adjustments_on_user_id  (user_id)
#
class TicketAdjustment < ApplicationRecord
  belongs_to :user, required: true
end
