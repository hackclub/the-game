# == Schema Information
#
# Table name: shop_items
#
#  id          :bigint           not null, primary key
#  description :text             not null
#  name        :string           not null
#  price       :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class ShopItem < ApplicationRecord
end
