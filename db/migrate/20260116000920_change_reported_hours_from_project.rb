class ChangeReportedHoursFromProject < ActiveRecord::Migration[8.1]
  def change
    rename_column :projects, :reported_hours, :total_seconds
  end
end
