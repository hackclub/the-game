class CreateGoals < ActiveRecord::Migration[8.1]
  def change
    create_table :goals do |t|
      t.references :item, null: false, foreign_key: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end
  end
end
