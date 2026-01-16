class AddRoleToUser < ActiveRecord::Migration[8.1]
  def up
    add_column :users, :role, :string, default: "user"

    User.all.each do |user|
      user.update!(role: "admin") if user.admin?
    end

    remove_column :users, :admin
  end

  def down
    add_column :users, :admin, :boolean, default: false

    User.all.each do |user|
      user.update!(admin: user.role === "admin")
    end

    remove_column :users, :role
  end
end
