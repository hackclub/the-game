class AddShopModeToPlatformSettings < ActiveRecord::Migration[8.1]
  def change
    add_column :platform_settings, :shop_mode, :string, default: "all", null: false
  end
end
