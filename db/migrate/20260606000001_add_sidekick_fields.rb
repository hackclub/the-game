class AddSidekickFields < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :fulfiller_context, :text
    add_column :item_purchases, :reference, :text
  end
end
