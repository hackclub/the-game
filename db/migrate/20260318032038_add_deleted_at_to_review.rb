class AddDeletedAtToReview < ActiveRecord::Migration[8.1]
  def change
    add_column :project_reviews, :deleted_at, :datetime
  end
end
