class AddStockToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :stock, :integer
  end
end
