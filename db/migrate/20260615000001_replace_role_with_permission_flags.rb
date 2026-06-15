class ReplaceRoleWithPermissionFlags < ActiveRecord::Migration[8.0]
  def up
    add_column :users, :is_admin, :boolean, default: false, null: false
    add_column :users, :is_reviewer, :boolean, default: false, null: false
    add_column :users, :is_fulfiller, :boolean, default: false, null: false

    execute <<~SQL
      UPDATE users SET is_admin = true WHERE role = 'admin';
      UPDATE users SET is_reviewer = true WHERE role = 'reviewer';
      UPDATE users SET is_fulfiller = true WHERE role = 'fulfiller';
    SQL

    remove_column :users, :role
  end

  def down
    add_column :users, :role, :string, default: "user"

    execute <<~SQL
      UPDATE users SET role = 'admin' WHERE is_admin = true;
      UPDATE users SET role = 'fulfiller' WHERE is_fulfiller = true AND is_admin = false;
      UPDATE users SET role = 'reviewer' WHERE is_reviewer = true AND is_admin = false AND is_fulfiller = false;
    SQL

    remove_column :users, :is_admin
    remove_column :users, :is_reviewer
    remove_column :users, :is_fulfiller
  end
end
