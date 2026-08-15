# == Schema Information
#
# Table name: platform_settings
#
#  id            :bigint           not null, primary key
#  shipping_mode :string           default("debt_only"), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
class PlatformSetting < ApplicationRecord
  SHIPPING_MODES = %w[all debt_only none].freeze

  validates :shipping_mode, inclusion: { in: SHIPPING_MODES }

  def self.instance
    first_or_create!(shipping_mode: "debt_only")
  end

  def shipping_allowed_for?(user)
    return true if user.admin?

    case shipping_mode
    when "all" then true
    when "debt_only" then user.debt?
    else false
    end
  end

  def display_hash
    as_json.slice("id", "shipping_mode")
  end
end
