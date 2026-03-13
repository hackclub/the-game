class CreateProjectTags < ActiveRecord::Migration[8.1]
  def change
    create_table :project_tags do |t|
      t.string :name

      t.timestamps
    end
  end
end
