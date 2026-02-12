require "date"

class AirtableService
  BASE_URL = "https://api.airtable.com/v0".freeze
  BASE_ID = "appG8V9462X6QDhpZ".freeze
  TABLE_ID = "tbldCj1zJQS2U5x9N".freeze

  def self.enabled?
    ENV["AIRTABLE_API_KEY"].present?
  end

  def self.optional_env?
    Rails.env.development? || Rails.env.test?
  end

  def self.available?
    enabled? || !optional_env?
  end

  def initialize
    @api_key = ENV["AIRTABLE_API_KEY"]
    return if @api_key.present?
    return if self.class.optional_env?

    raise KeyError, "AIRTABLE_API_KEY is not set"
  end

  def create_rsvp(email:, origin_ip:)
    return unless self.class.enabled?

    rsvp_connection.post do |req|
      req.body = {
        fields: {
          email: email,
          created_at: Time.now,
          origin_ip: origin_ip
        }
      }.to_json
    end
  end

  def get_rsvps
    return [] unless self.class.enabled?

    records = []
    result = { offset: nil }

    loop do
      response = rsvp_connection.get do |req|
        if result["offset"].present?
          req.params["offset"] = result["offset"]
        end
      end

      raise "fetch rsvps failed" unless response.status == 200

      result = response.body
      records += result["records"]

      break if result["offset"].nil?
    end

    records
  end

  def attach(record_id:, field_name:, type:, data:, name:)
    return unless self.class.enabled?

    connection.post "/#{record_id}/#{field_name}/uploadAttachment" do |req|
      req.body = {
        "contentType" => type,
        "file" => data,
        "filename" => name
      }
    end
  end

  private

  def rsvp_connection
    @rsvp_connection ||= Faraday.new(url: "#{BASE_URL}/#{BASE_ID}/#{TABLE_ID}") do |f|
      f.request :json
      f.response :json
      f.headers["Authorization"] = "Bearer #{@api_key}"
      f.headers["Content-Type"] = "application/json"
    end
  end

  def connection
    @connection ||= Faraday.new(url: "#{BASE_URL}/#{BASE_ID}") do |f|
      f.request :json
      f.response :json
      f.headers["Authorization"] = "Bearer #{@api_key}"
      f.headers["Content-Type"] = "application/json"
    end
  end
end
