class AddNotesToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :note, :text
    add_column :item_purchases, :admin_note, :text
  end
end
