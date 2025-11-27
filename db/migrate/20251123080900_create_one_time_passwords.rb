class CreateOneTimePasswords < ActiveRecord::Migration[8.1]
  def change
    create_table :one_time_passwords do |t|
      t.string :email, null: false
      t.string :secret, null: false
      t.datetime :expires_at

      t.timestamps
    end
  end
end
