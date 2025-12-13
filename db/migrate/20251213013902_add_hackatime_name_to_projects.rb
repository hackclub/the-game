class AddHackatimeNameToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :hackatime_name, :string
  end
end
