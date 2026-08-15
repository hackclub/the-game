class ChangeShippingEnabledToShippingModeOnPlatformSettings < ActiveRecord::Migration[8.1]
  def up
    add_column :platform_settings, :shipping_mode, :string, default: "debt_only", null: false
    execute "UPDATE platform_settings SET shipping_mode = CASE WHEN shipping_enabled THEN 'all' ELSE 'debt_only' END"
    remove_column :platform_settings, :shipping_enabled
  end

  def down
    add_column :platform_settings, :shipping_enabled, :boolean, default: true, null: false
    execute "UPDATE platform_settings SET shipping_enabled = (shipping_mode = 'all')"
    remove_column :platform_settings, :shipping_mode
  end
end
