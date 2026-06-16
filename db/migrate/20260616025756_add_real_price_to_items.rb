class AddRealPriceToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :real_price, :decimal, precision: 10, scale: 2
  end
end
