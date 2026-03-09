class AddAasmStateToItemPurchases < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :aasm_state, :string, default: "pending", null: false
  end
end
