class AddMilestonesToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :milestones, :jsonb, default: [], null: false
  end
end
