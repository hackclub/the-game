class AddGoldenPriceToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :golden_price, :integer
  end
end
