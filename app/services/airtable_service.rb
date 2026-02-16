require "date"

class AirtableService
  BASE_URL = "https://api.airtable.com/v0".freeze
  CONTENT_BASE_URL = "https://content.airtable.com/".freeze
  BASE_ID = "appG8V9462X6QDhpZ".freeze
  TABLE_ID = "tbldCj1zJQS2U5x9N".freeze

  def initialize
    @api_key = ENV.fetch("AIRTABLE_API_KEY")
  end

  def create_rsvp(email:, origin_ip:)
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
    res = content_connection.post "/v0/#{BASE_ID}/#{record_id}/#{field_name}/uploadAttachment" do |req|
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

  def content_connection
    @connection ||= Faraday.new(url: CONTENT_BASE_URL) do |f|
      f.request :json
      f.response :json
      f.headers["Authorization"] = "Bearer #{@api_key}"
      f.headers["Content-Type"] = "application/json"
    end
  end
end
