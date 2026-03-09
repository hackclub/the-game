class RemovePendingAtFromItemPurchase < ActiveRecord::Migration[8.1]
  def change
    remove_column :item_purchases, :pending_at, :datetime
  end
end
