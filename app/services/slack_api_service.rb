class SlackApiService
  BASE_URL = "https://slack.com/api"

  class << self
    # Whether the Slack API can be reached. Read-only calls (fetching
    # announcements, looking up users) only need a token. DRY_RUN does NOT
    # disable reads — it only suppresses writes (see #post_message).
    def available?
      ENV["SLACK_BOT_TOKEN"].present?
    end

    # When true, outbound Slack writes are suppressed.
    def dry_run?
      ENV["DRY_RUN"].present?
    end

    def client
      @client ||= Faraday.new(url: BASE_URL) do |conn|
        conn.request :authorization, "Bearer", ENV["SLACK_BOT_TOKEN"]
        conn.response :json, content_type: /\bjson$/
      end
    end

    # Fetches a private Slack file (e.g. an uploaded image) using the bot token.
    # Returns the raw Faraday response, or nil on failure.
    def fetch_file(url)
      return unless available?

      Faraday.get(url) do |req|
        req.headers["Authorization"] = "Bearer #{ENV['SLACK_BOT_TOKEN']}"
      end
    rescue => e
      Rails.logger.warn("Failed to fetch Slack file #{url}: #{e.message}")
      nil
    end

    def post_message(channel:, text:)
      return unless available?

      if dry_run?
        Rails.logger.info("[DRY_RUN] Skipping Slack message to #{channel}: #{text}")
        return
      end

      response = client.post("chat.postMessage") do |req|
        req.headers["Content-Type"] = "application/json; charset=utf-8"
        req.body = { channel: channel, text: text }.to_json
      end

      body = response.body.is_a?(Hash) ? response.body : {}
      Rails.logger.warn("Failed to post Slack message to #{channel}: #{body["error"]}") unless body["ok"]
    end
  end
end
