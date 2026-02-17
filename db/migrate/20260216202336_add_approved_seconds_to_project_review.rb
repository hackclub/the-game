class AddApprovedSecondsToProjectReview < ActiveRecord::Migration[8.1]
  def change
    add_column :project_reviews, :approved_seconds, :integer
  end
end
