class CreateShopItemPurchase < ActiveRecord::Migration[8.1]
  def change
    create_table :shop_item_purchases do |t|
      t.belongs_to :user, null: false
      t.belongs_to :shop_item, null: false

      t.timestamps
    end
  end
end
