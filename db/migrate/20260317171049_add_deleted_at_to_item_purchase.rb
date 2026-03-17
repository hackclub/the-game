class AddDeletedAtToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :deleted_at, :datetime
  end
end
