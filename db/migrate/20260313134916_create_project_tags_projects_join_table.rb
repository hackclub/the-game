class CreateProjectTagsProjectsJoinTable < ActiveRecord::Migration[8.1]
  def change
    create_join_table :project_tags, :projects do |t|
      t.index :project_tag_id
      t.index :project_id
    end
  end
end
