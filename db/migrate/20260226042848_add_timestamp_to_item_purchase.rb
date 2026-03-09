class AddTimestampToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :fulfill_at, :datetime
  end
end
