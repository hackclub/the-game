class AddReshipAllowanceToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :reship_allowed_at, :datetime
    add_column :projects, :reship_allowed_by_id, :bigint

    add_index :projects, :reship_allowed_by_id
  end
end
