class AddBlackMarketToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :black_market, :boolean, null: false, default: false
  end
end
