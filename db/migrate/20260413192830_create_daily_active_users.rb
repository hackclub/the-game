class CreateDailyActiveUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :daily_active_users do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false

      t.timestamps
    end

    add_index :daily_active_users, [:user_id, :date], unique: true
  end
end
