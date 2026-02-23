class AddHighQualityToProject < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :high_quality, :boolean, null: false, default: false
  end
end
