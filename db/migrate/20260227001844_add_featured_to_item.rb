class AddFeaturedToItem < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :featurted, :boolean
  end
end
