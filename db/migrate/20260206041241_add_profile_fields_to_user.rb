class AddProfileFieldsToUser < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :address_street, :string
    add_column :users, :address_locality, :string
    add_column :users, :address_region, :string
    add_column :users, :address_postal, :string
    add_column :users, :address_country, :string
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
  end
end
