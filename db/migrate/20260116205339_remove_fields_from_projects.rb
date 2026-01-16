class RemoveFieldsFromProjects < ActiveRecord::Migration[8.1]
  def change
    remove_column :projects, :readme_link, :string
    remove_column :projects, :reviewer_note, :text
  end
end
