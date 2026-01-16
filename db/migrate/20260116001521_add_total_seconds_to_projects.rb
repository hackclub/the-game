class AddTotalSecondsToProjects < ActiveRecord::Migration[8.1]
  def change
    change_column :projects, :total_seconds, :integer
  end
end
