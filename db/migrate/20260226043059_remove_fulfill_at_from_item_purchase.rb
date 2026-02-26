class RemoveFulfillAtFromItemPurchase < ActiveRecord::Migration[8.1]
  def change
    remove_column :item_purchases, :fulfill_at, :datetime
  end
end
