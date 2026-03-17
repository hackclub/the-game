class SlackChannelInviteService
  BASE_URL = "https://hackclub.slack.com/api"
  CHANNELS = {
    "C0A7HQZFFNX" => "hctg-bulletin",
    "C088DT8P7B8" => "hack-club-the-game",
    "C0A9XULS1SL" => "hctg-help"
  }.freeze

  def self.available?
    ENV["SLACK_XOXD_TOKEN"].present? && ENV["SLACK_XOXC_TOKEN"].present?
  end

  def self.invite_user(slack_id)
    return if slack_id.blank? || !available?

    new(slack_id).invite_user
  end

  def initialize(slack_id, client: nil)
    @slack_id = slack_id
    @client = client || slack_client
  end

  def invite_user
    CHANNELS.each do |channel_id, channel_name|
      response = client.post("conversations.invite") do |req|
        req.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8"
        req.headers["Cookie"] = "d=#{ENV["SLACK_XOXD_TOKEN"]}"
        req.body = URI.encode_www_form(channel: channel_id, users: slack_id, token: ENV["SLACK_XOXC_TOKEN"])
      end

      body = response.body.is_a?(Hash) ? response.body : {}

      next if response.success? && body["ok"]
      next if body["error"] == "already_in_channel"

      Rails.logger.warn("Failed to add Slack user #{slack_id} to #{channel_name} (#{channel_id}): #{body["error"] || response.status}")
    end
  end

  private

  attr_reader :client, :slack_id

  def slack_client
    Faraday.new(url: BASE_URL) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
