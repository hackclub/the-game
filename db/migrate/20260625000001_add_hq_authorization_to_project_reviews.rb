class AddHqAuthorizationToProjectReviews < ActiveRecord::Migration[8.1]
  def up
    add_column :project_reviews, :authorized_at, :datetime
    add_column :project_reviews, :authorized_by_id, :bigint
    add_index :project_reviews, :authorized_by_id

    # Existing approvals predate HQ review and are already published, so treat
    # them as authorized at their creation time to avoid retroactively hiding them.
    execute <<~SQL.squish
      UPDATE project_reviews
      SET authorized_at = created_at
      WHERE review_type = 'approval' AND authorized_at IS NULL
    SQL
  end

  def down
    remove_column :project_reviews, :authorized_by_id
    remove_column :project_reviews, :authorized_at
  end
end
