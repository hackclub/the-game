class CreateReferralSystem < ActiveRecord::Migration[8.1]
  def change
    create_table :referrals do |t|
      t.references :referrer, null: false, foreign_key: { to_table: :users }
      t.references :referred_user, null: false, foreign_key: { to_table: :users }, index: { unique: true }
      t.string :code, null: false
      t.integer :tickets_awarded, default: 0
      t.boolean :shipped, default: false

      t.timestamps
    end

    add_index :referrals, :code

    create_table :referral_program do |t|
      t.integer :referrer_bonus_percentage, default: 10
      t.integer :referred_bonus_tickets, default: 5
      t.integer :max_referrers, default: 100
      t.integer :rollout_batch_size, default: 10
      t.integer :rollout_interval_hours, default: 24
      t.string :rollout_status, default: "paused"
      t.datetime :last_rollout_at
      t.integer :rollout_count, default: 0
      t.text :slack_message_template

      t.timestamps
    end

    add_column :users, :referral_eligible, :boolean, default: false
  end
end
