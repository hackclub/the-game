class AddTimestampsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_timestamps :users, null: false, default: -> { 'CURRENT_TIMESTAMP' }
  end
end
