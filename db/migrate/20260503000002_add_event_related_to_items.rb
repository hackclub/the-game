class AddEventRelatedToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :event_related, :boolean, default: false, null: false
  end
end
