class CreateItemPurchase < ActiveRecord::Migration[8.1]
  def change
    create_table :item_purchases do |t|
      t.belongs_to :user, null: false
      t.belongs_to :item, null: false

      t.timestamps
    end
  end
end
