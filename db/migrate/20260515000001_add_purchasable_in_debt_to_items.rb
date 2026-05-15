class AddPurchasableInDebtToItems < ActiveRecord::Migration[8.0]
  def change
    add_column :items, :purchasable_in_debt, :boolean, default: false, null: false
  end
end
