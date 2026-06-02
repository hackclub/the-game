class AddReferralShareCodeToUsers < ActiveRecord::Migration[8.1]
  def up
    add_column :users, :referral_share_code, :string
    add_index :users, :referral_share_code, unique: true

    User.find_each do |u|
      u.update_column(:referral_share_code, Digest::SHA256.hexdigest("referral-#{u.id}-#{u.created_at}")[0, 8])
    end
  end

  def down
    remove_column :users, :referral_share_code
  end
end
