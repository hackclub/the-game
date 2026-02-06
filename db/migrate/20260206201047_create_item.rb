class CreateItem < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :name, null: false
      t.integer :price, null: false
      t.text :description, null: false

      t.timestamps
    end
  end
end
