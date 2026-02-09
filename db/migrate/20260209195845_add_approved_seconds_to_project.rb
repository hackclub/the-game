class AddApprovedSecondsToProject < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :approved_seconds, :integer
  end
end
