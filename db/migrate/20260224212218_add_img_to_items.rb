class AddImgToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :img, :string
  end
end
