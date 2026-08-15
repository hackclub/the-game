class AddShopApprovedToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :is_shop_approved, :boolean, default: false, null: false
  end
end
