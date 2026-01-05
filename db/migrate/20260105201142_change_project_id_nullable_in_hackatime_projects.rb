class ChangeProjectIdNullableInHackatimeProjects < ActiveRecord::Migration[8.1]
  def change
    change_column_null :hackatime_projects, :project_id, true
    remove_foreign_key :hackatime_projects, :projects
  end
end
