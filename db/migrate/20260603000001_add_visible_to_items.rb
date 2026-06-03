class AddVisibleToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :visible, :boolean, default: true, null: false
  end
end
