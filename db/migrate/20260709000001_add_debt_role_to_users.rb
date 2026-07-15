class AddDebtRoleToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :is_debt, :boolean, default: false, null: false
  end
end
