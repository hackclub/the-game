class SetUserThreeAsAdmin < ActiveRecord::Migration[8.1]
  def up
    User.find(3).update!(admin: true)
  end

  def down
    User.find(3).update!(admin: false)
  end
end
