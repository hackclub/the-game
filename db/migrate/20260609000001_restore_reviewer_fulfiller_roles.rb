class RestoreReviewerFulfillerRoles < ActiveRecord::Migration[8.1]
  def up
    # The previous migration moved reviewer/fulfiller roles to boolean columns.
    # This restores them back to the role string column and drops the booleans.
    if column_exists?(:users, :is_reviewer) || column_exists?(:users, :is_fulfiller)
      execute <<~SQL
        UPDATE users SET role = 'fulfiller' WHERE is_fulfiller = true;
        UPDATE users SET role = 'reviewer'  WHERE is_reviewer = true AND is_fulfiller = false;
      SQL

      remove_column :users, :is_reviewer if column_exists?(:users, :is_reviewer)
      remove_column :users, :is_fulfiller if column_exists?(:users, :is_fulfiller)
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
