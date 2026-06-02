class AddUserNoteToItemPurchases < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :user_note, :text
  end
end
