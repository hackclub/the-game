class RemoveProcessingAtFromItemPurchase < ActiveRecord::Migration[8.1]
  def change
    remove_column :item_purchases, :processing_at, :datetime
  end
end
