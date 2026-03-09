class AddTimestampsToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :hold_at, :datetime
    add_column :item_purchases, :pending_at, :datetime
  end
end
