class SlackChannelInviteService
  BASE_URL = "https://hackclub.slack.com/api"
  CHANNELS = SlackChannels::ALL.except(SlackChannels::TRACKER).freeze

  def self.available?
    ENV["SLACK_XOXD_TOKEN"].present? && ENV["SLACK_XOXC_TOKEN"].present?
  end

  def self.invite_user(slack_id)
    return if slack_id.blank? || !available?

    new(slack_id).invite_user
  end

  def initialize(slack_id, client: nil)
    @slack_id = slack_id
    @client = client || user_token_client
  end

  MAX_RETRIES = 3

  def invite_user
    @use_bot_token = full_workspace_member?
    if @use_bot_token
      Rails.logger.info("SlackChannelInviteService: #{slack_id} is a full member, using bot token")
    else
      Rails.logger.info("SlackChannelInviteService: #{slack_id} is a guest/unboarded user, using user token")
    end

    CHANNELS.each do |channel_id, channel_name|
      invite_to_channel(channel_id, channel_name)
    end
  end

  private

  # Returns true only if the user is a full workspace member (not a guest).
  # Multi-channel guests (is_restricted) and single-channel guests (is_ultra_restricted)
  # must still be invited via the user token.
  def full_workspace_member?
    return false unless SlackApiService.available?

    response = SlackApiService.client.get("users.info") do |req|
      req.params["user"] = slack_id
    end

    body = response.body.is_a?(Hash) ? response.body : {}
    return false unless body["ok"]

    user = body["user"] || {}
    !user["is_restricted"] && !user["is_ultra_restricted"] && !user["deleted"]
  rescue => e
    Rails.logger.warn("SlackChannelInviteService: could not determine membership type for #{slack_id}: #{e.message}")
    false
  end

  def invite_to_channel(channel_id, channel_name, attempt: 1)
    response = if @use_bot_token
      SlackApiService.client.post("conversations.invite") do |req|
        req.headers["Content-Type"] = "application/json; charset=utf-8"
        req.body = { channel: channel_id, users: slack_id }.to_json
      end
    else
      client.post("conversations.invite") do |req|
        req.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8"
        req.headers["Cookie"] = "d=#{ENV["SLACK_XOXD_TOKEN"]}"
        req.body = URI.encode_www_form(channel: channel_id, users: slack_id, token: ENV["SLACK_XOXC_TOKEN"])
      end
    end

    body = response.body.is_a?(Hash) ? response.body : {}

    return if response.success? && body["ok"]
    return if body["error"] == "already_in_channel"

    if response.status == 429 || body["error"] == "ratelimited"
      if attempt <= MAX_RETRIES
        wait = (response.headers["Retry-After"] || 30).to_i
        Rails.logger.warn("Rate limited by Slack, retrying #{channel_name} in #{wait}s (attempt #{attempt}/#{MAX_RETRIES})")
        sleep(wait)
        return invite_to_channel(channel_id, channel_name, attempt: attempt + 1)
      else
        Rails.logger.warn("Rate limited by Slack, giving up on #{channel_name} after #{MAX_RETRIES} attempts")
        return
      end
    end

    Rails.logger.warn("Failed to add Slack user #{slack_id} to #{channel_name} (#{channel_id}): #{body["error"] || response.status}")
  end

  attr_reader :client, :slack_id

  def user_token_client
    Faraday.new(url: BASE_URL) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
