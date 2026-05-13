class AddGrantsPlatformAccessToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :grants_platform_access, :boolean, default: false, null: false
  end
end
