class AddLinkToNotifications < ActiveRecord::Migration[8.1]
  def change
    add_column :notifications, :link, :string
  end
end
