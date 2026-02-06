# == Schema Information
#
# Table name: shop_item_purchases
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  shop_item_id :bigint           not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_shop_item_purchases_on_shop_item_id  (shop_item_id)
#  index_shop_item_purchases_on_user_id       (user_id)
#
class ShopItem
  class Purchase < ApplicationRecord
    belongs_to :user
    belongs_to :shop_item
  end
end
