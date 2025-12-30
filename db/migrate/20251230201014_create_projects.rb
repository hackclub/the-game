class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.integer :approved
      t.decimal :reported_hours, precision: 3, scale: 1
      t.string :demo_link
      t.string :hackatime_project_keys
      t.text :desc
      t.boolean :is_deleted
      t.integer :review_status
      t.string :repo_link
      t.string :readme_link
      t.string :title
      t.references :user, null: false, foreign_key: true
      t.boolean :shipped
      t.text :reviewer_note
      t.string :ysws
      t.string :project_type
      t.text :internal_notes
      t.datetime :submitted_at

      t.timestamps
    end
  end
end
