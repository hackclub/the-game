# == Schema Information
#
# Table name: item_purchases
#
#  id         :bigint           not null, primary key
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
    belongs_to :user
    belongs_to :item
  end
end
