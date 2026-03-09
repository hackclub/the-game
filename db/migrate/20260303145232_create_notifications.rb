class CreateNotifications < ActiveRecord::Migration[8.1]
  def change
    create_table :notifications do |t|
      t.belongs_to :user, null: false
      t.belongs_to :notifiable, polymorphic: true, null: false
      t.string :message, null: false
      t.boolean :read, null: false, default: false

      t.timestamps
    end
  end
end
