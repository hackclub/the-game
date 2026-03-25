class SlackApiService
  BASE_URL = "https://slack.com/api"

  class << self
    def available?
      ENV["SLACK_BOT_TOKEN"].present?
    end

    def client
      @client ||= Faraday.new(url: BASE_URL) do |conn|
        conn.request :authorization, "Bearer", ENV["SLACK_BOT_TOKEN"]
        conn.response :json, content_type: /\bjson$/
      end
    end
  end
end
