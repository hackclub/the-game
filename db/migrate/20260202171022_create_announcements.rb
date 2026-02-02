class CreateAnnouncements < ActiveRecord::Migration[8.1]
  def change
    create_table :announcements do |t|
      t.belongs_to :user, null: false
      t.string :title
      t.text :content

      t.datetime :deleted_at
      t.timestamps
    end
  end
end
