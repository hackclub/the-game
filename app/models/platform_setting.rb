# == Schema Information
#
# Table name: platform_settings
#
#  id                :bigint           not null, primary key
#  shipping_enabled  :boolean          default(TRUE), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class PlatformSetting < ApplicationRecord
  def self.instance
    first_or_create!(shipping_enabled: true)
  end

  def display_hash
    as_json.slice("id", "shipping_enabled")
  end
end
