class AddAdminOnlyToProjectReview < ActiveRecord::Migration[8.1]
  def change
    add_column :project_reviews, :admin_only, :boolean, null: false, default: false
  end
end
