class RemoveImgFromItems < ActiveRecord::Migration[8.1]
  def change
    remove_column :items, :img, :string
  end
end
