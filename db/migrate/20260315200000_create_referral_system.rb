class CreateReferralSystem < ActiveRecord::Migration[8.1]
  def change
    create_table :referrals do |t|
      t.references :referrer, null: false, foreign_key: { to_table: :users }
      t.references :referred_user, null: false, foreign_key: { to_table: :users }, index: { unique: true }
      t.string :code, null: false
      t.integer :raffle_entries, default: 0
      t.boolean :shipped, default: false

      t.timestamps
    end

    add_index :referrals, :code

    create_table :referral_program do |t|
      t.boolean :active, default: false
      t.integer :referrer_raffle_entries, default: 1
      t.integer :referred_raffle_entries, default: 1
      t.string :raffle_title
      t.text :raffle_description
      t.string :raffle_image_url
      t.string :homepage_alert_title
      t.text :homepage_alert_description
      t.text :invite_page_description

      t.timestamps
    end
  end
end
