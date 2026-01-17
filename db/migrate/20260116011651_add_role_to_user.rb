class AddRoleToUser < ActiveRecord::Migration[8.1]
  def up
    add_column :users, :role, :string, default: "user"

    execute "UPDATE users SET role = 'admin' WHERE admin = true"

    remove_column :users, :admin
  end

  def down
    add_column :users, :admin, :boolean, default: false

    execute "UPDATE users SET admin = true WHERE role = 'admin'"

    remove_column :users, :role
  end
end
