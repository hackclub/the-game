class SlackApiService
  BASE_URL = "https://slack.com/api"

  class << self
    def available?
      ENV["SLACK_BOT_TOKEN"].present? && !ENV["DRY_RUN"].present?
    end

    def client
      @client ||= Faraday.new(url: BASE_URL) do |conn|
        conn.request :authorization, "Bearer", ENV["SLACK_BOT_TOKEN"]
        conn.response :json, content_type: /\bjson$/
      end
    end

    def post_message(channel:, text:)
      return unless available?

      response = client.post("chat.postMessage") do |req|
        req.headers["Content-Type"] = "application/json; charset=utf-8"
        req.body = { channel: channel, text: text }.to_json
      end

      body = response.body.is_a?(Hash) ? response.body : {}
      Rails.logger.warn("Failed to post Slack message to #{channel}: #{body["error"]}") unless body["ok"]
    end
  end
end
