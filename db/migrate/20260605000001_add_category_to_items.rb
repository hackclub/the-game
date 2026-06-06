class AddCategoryToItems < ActiveRecord::Migration[8.0]
  def up
    add_column :items, :category, :string

    # Auto-assign grants category to items with "grant" in the name
    execute <<~SQL
      UPDATE items SET category = 'grants' WHERE LOWER(name) LIKE '%grant%'
    SQL
  end

  def down
    remove_column :items, :category
  end
end
