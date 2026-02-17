class AddAdminContentToProjectReview < ActiveRecord::Migration[8.1]
  def change
    add_column :project_reviews, :admin_content, :text
    remove_column :project_reviews, :admin_only, :boolean
  end
end
