# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_09_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "fuzzystrmatch"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_trgm"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "announcements", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.string "title"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_announcements_on_user_id"
  end

  create_table "blazer_audits", force: :cascade do |t|
    t.datetime "created_at"
    t.string "data_source"
    t.bigint "query_id"
    t.text "statement"
    t.bigint "user_id"
    t.index ["query_id"], name: "index_blazer_audits_on_query_id"
    t.index ["user_id"], name: "index_blazer_audits_on_user_id"
  end

  create_table "blazer_checks", force: :cascade do |t|
    t.string "check_type"
    t.datetime "created_at", null: false
    t.bigint "creator_id"
    t.text "emails"
    t.datetime "last_run_at"
    t.text "message"
    t.bigint "query_id"
    t.string "schedule"
    t.text "slack_channels"
    t.string "state"
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_checks_on_creator_id"
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "dashboard_id"
    t.integer "position"
    t.bigint "query_id"
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_blazer_dashboard_queries_on_dashboard_id"
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "creator_id"
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_dashboards_on_creator_id"
  end

  create_table "blazer_queries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "creator_id"
    t.string "data_source"
    t.text "description"
    t.string "name"
    t.text "statement"
    t.string "status"
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_queries_on_creator_id"
  end

  create_table "daily_active_users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id", "date"], name: "index_daily_active_users_on_user_id_and_date", unique: true
    t.index ["user_id"], name: "index_daily_active_users_on_user_id"
  end

  create_table "hackatime_projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.bigint "project_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["project_id"], name: "index_hackatime_projects_on_project_id"
    t.index ["user_id"], name: "index_hackatime_projects_on_user_id"
  end

  create_table "item_purchases", force: :cascade do |t|
    t.string "aasm_state", default: "pending", null: false
    t.text "admin_note"
    t.integer "amount_paid", null: false
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.datetime "fulfilled_at"
    t.datetime "hold_at"
    t.bigint "item_id", null: false
    t.text "note"
    t.integer "quantity", default: 1, null: false
    t.text "reference"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.text "user_note"
    t.index ["item_id"], name: "index_item_purchases_on_item_id"
    t.index ["user_id"], name: "index_item_purchases_on_user_id"
  end

  create_table "items", force: :cascade do |t|
    t.boolean "black_market", default: false, null: false
    t.string "category"
    t.datetime "created_at", null: false
    t.text "description", null: false
    t.boolean "event_related", default: false, null: false
    t.boolean "featured", default: false, null: false
    t.text "fulfiller_context"
    t.boolean "grants_platform_access", default: false, null: false
    t.string "name", null: false
    t.boolean "one_per_user", default: false, null: false
    t.integer "price", null: false
    t.integer "stock"
    t.boolean "super_featured", default: false, null: false
    t.datetime "updated_at", null: false
    t.boolean "visible", default: true, null: false
  end

  create_table "milestones", force: :cascade do |t|
    t.string "/"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "link"
    t.string "message", null: false
    t.bigint "notifiable_id", null: false
    t.string "notifiable_type", null: false
    t.boolean "read", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["notifiable_type", "notifiable_id"], name: "index_notifications_on_notifiable"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "one_time_passwords", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.datetime "expires_at"
    t.string "secret", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_reviews", force: :cascade do |t|
    t.text "admin_content"
    t.integer "approved_seconds"
    t.bigint "author_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.bigint "project_id", null: false
    t.string "review_type"
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_project_reviews_on_author_id"
    t.index ["project_id"], name: "index_project_reviews_on_project_id"
  end

  create_table "project_tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "project_tags_projects", id: false, force: :cascade do |t|
    t.bigint "project_id", null: false
    t.bigint "project_tag_id", null: false
    t.index ["project_id"], name: "index_project_tags_projects_on_project_id"
    t.index ["project_tag_id"], name: "index_project_tags_projects_on_project_tag_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "aasm_state"
    t.text "ai_declaration"
    t.datetime "approved_at"
    t.integer "approved_seconds"
    t.datetime "created_at", null: false
    t.datetime "deleted_at"
    t.string "demo_link"
    t.text "desc"
    t.boolean "high_quality", default: false, null: false
    t.text "internal_notes"
    t.string "project_type"
    t.datetime "rejected_at"
    t.string "repo_link"
    t.datetime "submitted_at"
    t.string "title"
    t.integer "total_seconds"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.string "ysws"
    t.index ["deleted_at"], name: "index_projects_on_deleted_at"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "referral_program", force: :cascade do |t|
    t.boolean "active", default: false
    t.datetime "created_at", null: false
    t.text "homepage_alert_description"
    t.string "homepage_alert_title"
    t.text "invite_page_description"
    t.text "og_description_template"
    t.text "raffle_description"
    t.string "raffle_image_url"
    t.string "raffle_title"
    t.bigint "referred_item_id"
    t.integer "referred_raffle_entries", default: 1
    t.integer "referrer_raffle_entries", default: 1
    t.datetime "updated_at", null: false
  end

  create_table "referrals", force: :cascade do |t|
    t.string "code", null: false
    t.datetime "created_at", null: false
    t.integer "raffle_entries", default: 0
    t.bigint "referred_user_id", null: false
    t.bigint "referrer_id", null: false
    t.boolean "shipped", default: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_referrals_on_code"
    t.index ["referred_user_id"], name: "index_referrals_on_referred_user_id", unique: true
    t.index ["referrer_id"], name: "index_referrals_on_referrer_id"
  end

  create_table "ticket_adjustments", force: :cascade do |t|
    t.integer "amount", null: false
    t.datetime "created_at", null: false
    t.string "reason"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_ticket_adjustments_on_user_id"
  end

  create_table "ticket_transfers", force: :cascade do |t|
    t.string "aasm_state", null: false
    t.integer "amount", null: false
    t.datetime "approved_at"
    t.datetime "created_at", null: false
    t.bigint "from_user_id", null: false
    t.string "reason", null: false
    t.datetime "rejected_at"
    t.bigint "to_user_id", null: false
    t.datetime "updated_at", null: false
    t.index ["from_user_id"], name: "index_ticket_transfers_on_from_user_id"
    t.index ["to_user_id"], name: "index_ticket_transfers_on_to_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "account_access_token"
    t.string "account_id"
    t.string "address_country"
    t.string "address_locality"
    t.string "address_postal"
    t.string "address_region"
    t.string "address_street"
    t.string "avatar"
    t.integer "ban_type"
    t.date "birthday"
    t.boolean "can_overspend", default: false, null: false
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "deleted_at"
    t.string "email", null: false
    t.string "first_name"
    t.string "hackatime_access_token"
    t.string "hackatime_id"
    t.text "internal_notes"
    t.boolean "is_banned", default: false, null: false
    t.datetime "last_active"
    t.string "last_name"
    t.boolean "onboarding_completed", default: false, null: false
    t.string "referral_code"
    t.string "referral_share_code"
    t.bigint "referrer_id"
    t.string "role", default: "user"
    t.string "slack_id"
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string "username"
    t.string "verification_status"
    t.boolean "ysws_verified"
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["referral_share_code"], name: "index_users_on_referral_share_code", unique: true
    t.index ["referrer_id"], name: "index_users_on_referrer_id"
  end

  create_table "versions", force: :cascade do |t|
    t.datetime "created_at"
    t.string "event", null: false
    t.bigint "item_id", null: false
    t.string "item_type", null: false
    t.jsonb "object"
    t.jsonb "object_changes"
    t.string "whodunnit"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "daily_active_users", "users"
  add_foreign_key "hackatime_projects", "users"
  add_foreign_key "projects", "users"
  add_foreign_key "referral_program", "items", column: "referred_item_id"
  add_foreign_key "referrals", "users", column: "referred_user_id"
  add_foreign_key "referrals", "users", column: "referrer_id"
end
