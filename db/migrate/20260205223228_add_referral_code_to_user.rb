class AddReferralCodeToUser < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :referral_code, :string
  end
end
