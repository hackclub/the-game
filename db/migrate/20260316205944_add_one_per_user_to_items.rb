class AddOnePerUserToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :one_per_user, :boolean, default: false, null: false
  end
end
