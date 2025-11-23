class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string "avatar"
      t.string "slack_id"
      t.string "username"
      t.string "timezone_raw"
      t.boolean "is_banned", default: false, null: false
      t.string "email", null: false
      t.string "github_username"
      t.datetime "last_active"
      t.bigint "referrer_id"
      t.string "identity_vault_access_token"
      t.string "identity_vault_id"
      t.boolean "ysws_verified"
      t.text "internal_notes"
      t.integer "ban_type"
      t.date "birthday"
      t.boolean "is_pro", default: false
      t.boolean "admin", default: false, null: false

      t.index [ "referrer_id" ], name: "index_users_on_referrer_id"
    end
  end
end
