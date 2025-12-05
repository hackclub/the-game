class AirtableService
  BASE_URL = "https://api.airtable.com/v0".freeze
  BASE_ID = "appG8V9462X6QDhpZ".freeze
  TABLE_ID = "tbldCj1zJQS2U5x9N".freeze

  def initialize
    @api_key = ENV.fetch("AIRTABLE_API_KEY_RSVP")
  end

  def create_rsvp(email:, origin_ip:)
    connection.post do |req|
      req.body = {
        fields: {
          email: email,
          created_at: Time.current.strftime("%Y-%m-%d"),
          origin_ip: origin_ip
        }
      }.to_json
    end
  end

  private

  def connection
    @connection ||= Faraday.new(url: "#{BASE_URL}/#{BASE_ID}/#{TABLE_ID}") do |f|
      f.request :json
      f.response :json
      f.headers["Authorization"] = "Bearer #{@api_key}"
      f.headers["Content-Type"] = "application/json"
    end
  end
end
