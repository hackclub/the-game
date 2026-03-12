class AddQuantityToItemPurchases < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :quantity, :integer, default: 1, null: false
  end
end
