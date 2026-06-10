class AirpplicationRecord < AirctiveRecord::Base
  self.base_key = "appG8V9462X6QDhpZ"

  def self.airtable_enabled?
    ENV["AIRTABLE_API_KEY"].present? && !ENV["DRY_RUN"].present?
  end

  def self.airtable_optional_env?
    Rails.env.development? || Rails.env.test?
  end

  def self.airtable_available?
    airtable_enabled? || !airtable_optional_env?
  end
end
