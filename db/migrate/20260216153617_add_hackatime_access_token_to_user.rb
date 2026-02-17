class AddHackatimeAccessTokenToUser < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :hackatime_access_token, :string
  end
end
