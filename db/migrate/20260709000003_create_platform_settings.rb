class CreatePlatformSettings < ActiveRecord::Migration[8.1]
  def change
    # Singleton table (single row) holding platform-wide toggles, following the
    # same pattern as referral_program.
    create_table :platform_settings do |t|
      t.boolean :shipping_enabled, default: true, null: false

      t.timestamps
    end
  end
end
