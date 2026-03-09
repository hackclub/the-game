class RemoveFeaturedFromItemPurchase < ActiveRecord::Migration[8.1]
  def change
    remove_column :item_purchases, :featurted, :boolean
  end
end
