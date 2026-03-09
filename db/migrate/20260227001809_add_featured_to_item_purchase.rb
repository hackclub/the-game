class AddFeaturedToItemPurchase < ActiveRecord::Migration[8.1]
  def change
    add_column :item_purchases, :featurted, :boolean
  end
end
