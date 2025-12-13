# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

if Rails.env.development?
  User.find_or_create_by!(email: "dev@hackclub.com") do |user|
    user.username = "DevUser"
    user.slack_id = "U00DEV00000"
    user.admin = true
  end

  User.find_or_create_by!(email: "player@hackclub.com") do |user|
    user.username = "TestPlayer"
    user.slack_id = "U00PLAY0000"
  end
end
