class RemoveHackatimeProjectKeysFromProject < ActiveRecord::Migration[8.1]
  def change
    remove_column :projects, :hackatime_project_keys, :string
  end
end
