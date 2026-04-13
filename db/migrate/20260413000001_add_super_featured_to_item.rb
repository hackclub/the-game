class AddSuperFeaturedToItem < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :super_featured, :boolean, null: false, default: false
  end
end
