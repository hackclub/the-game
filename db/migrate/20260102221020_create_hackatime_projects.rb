class CreateHackatimeProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :hackatime_projects do |t|
      t.string :name
      t.references :project, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
