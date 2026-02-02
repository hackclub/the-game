class CreateProjectReviews < ActiveRecord::Migration[8.1]
  def change
    create_table :project_reviews do |t|
      t.string :review_type
      t.text :content

      t.belongs_to :project, null: false
      t.belongs_to :author, null: false

      t.timestamps
    end
  end
end
