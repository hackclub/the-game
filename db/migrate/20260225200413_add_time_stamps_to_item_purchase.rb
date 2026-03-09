class AddTimeStampsToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :processing_at, :datetime
    add_column :item_purchases, :fulfilled_at, :datetime
  end
end
