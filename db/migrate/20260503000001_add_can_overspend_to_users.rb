class AddCanOverspendToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :can_overspend, :boolean, default: false, null: false
  end
end
