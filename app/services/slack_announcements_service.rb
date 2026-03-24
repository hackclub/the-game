class SlackAnnouncementsService
  BASE_URL = "https://slack.com/api"
  CHANNEL_ID = "C0A7HQZFFNX"
  CACHE_TTL = 5.minutes
  MAX_ANNOUNCEMENTS = 10
  CHANNEL_NAMES = {
    "C0AJ70Q994L" => "hctg-tracker",
    "C0A7HQZFFNX" => "hctg-bulletin",
    "C088DT8P7B8" => "hack-club-the-game",
    "C0A9XULS1SL" => "hctg-help"
  }.freeze

  @cache_mutex = Mutex.new
  @announcements_cache = nil
  @announcements_cached_at = nil
  @user_cache = {}
  @user_cache_times = {}
  @channel_cache = {}
  @channel_cache_times = {}

  class << self
    def available?
      ENV["SLACK_BOT_TOKEN"].present?
    end

    def fetch_announcements
      @cache_mutex.synchronize do
        if @announcements_cache && @announcements_cached_at && @announcements_cached_at > CACHE_TTL.ago
          return @announcements_cache
        end
      end

      announcements = fetch_and_filter_messages

      @cache_mutex.synchronize do
        @announcements_cache = announcements
        @announcements_cached_at = Time.current
      end

      announcements
    end

    private

    def fetch_and_filter_messages
      response = slack_client.get("conversations.history") do |req|
        req.params = { channel: CHANNEL_ID, limit: 200 }
      end

      return [] unless response.success? && response.body["ok"]

      all_messages = response.body["messages"]
      messages = []

      all_messages.each do |msg|
        next unless msg["text"]&.match?(/<!channel>|<!here>/)

        # If message has @here and is less than 8 chars, use previous message instead
        if msg["text"].include?("<!here>") && msg["text"].length < 16
          prev_msg = all_messages[all_messages.index(msg) + 1]
          messages << prev_msg if prev_msg
        else
          messages << msg
        end

        break if messages.length >= MAX_ANNOUNCEMENTS
      end

      messages.map { |m| build_announcement(m) }
    end

    def build_announcement(message)
      user = fetch_user(message["user"])
      permalink = fetch_permalink(message["ts"])

      {
        author_name: user[:name],
        author_avatar_url: user[:avatar_url],
        content: format_message(message["text"]),
        timestamp: Time.at(message["ts"].to_f).utc.iso8601,
        permalink: permalink
      }
    end

    def fetch_user(user_id)
      return { name: "Unknown", avatar_url: nil } if user_id.blank?

      @cache_mutex.synchronize do
        if @user_cache[user_id] && @user_cache_times[user_id] && @user_cache_times[user_id] > CACHE_TTL.ago
          return @user_cache[user_id]
        end
      end

      response = slack_client.get("users.info") do |req|
        req.params = { user: user_id }
      end

      user_data = if response.success? && response.body["ok"]
        slack_user = response.body["user"]
        profile = response.body["user"]["profile"]
        {
          name: slack_user["name"].presence || "Unknown",
          avatar_url: profile["image_72"]
        }
      else
        { name: "Unknown", avatar_url: nil }
      end

      @cache_mutex.synchronize do
        @user_cache[user_id] = user_data
        @user_cache_times[user_id] = Time.current
      end

      user_data
    end

    def fetch_permalink(message_ts)
      response = slack_client.get("chat.getPermalink") do |req|
        req.params = { channel: CHANNEL_ID, message_ts: message_ts }
      end

      return nil unless response.success? && response.body["ok"]

      response.body["permalink"]
    end

    def format_message(text)
      return "" if text.blank?

      text = text.gsub(/<#([A-Z0-9]+)(?:\|[^>]+)?>/) { "##{fetch_channel_name($1)}" }
      text = text.gsub(/<@U[A-Z0-9]+>/, "")
      text = text.gsub(/<!channel>|<!here>|<!everyone>/, "")
      text = text.gsub(/:[a-zA-Z0-9_+-]+:/, "")
      text = text.gsub(/<(https?:\/\/[^|>]+)\|([^>]+)>/) { %(<a href="#{$1}">#{$2}</a>) }
      text = text.gsub(/<(https?:\/\/[^>]+)>/) { %(<a href="#{$1}">#{$1}</a>) }
      text = text.gsub(/\*_(.*?)_\*|_\*(.*?)\*_/) { "<strong><em>#{$1 || $2}</em></strong>" }
      text = text.gsub(/\*([^*]+)\*/) { "<strong>#{$1}</strong>" }
      text = text.gsub(/(?<!\w)_([^_]+)_(?!\w)/) { "<em>#{$1}</em>" }
      text = text.gsub(/`([^`]+)`/) { "<code>#{$1}</code>" }
      text.strip
    end

    def fetch_channel_name(channel_id)
      return channel_id if channel_id.blank?

      @cache_mutex.synchronize do
        if @channel_cache[channel_id] && @channel_cache_times[channel_id] && @channel_cache_times[channel_id] > CACHE_TTL.ago
          return @channel_cache[channel_id]
        end
      end

      if CHANNEL_NAMES.key?(channel_id)
        channel_name = CHANNEL_NAMES[channel_id]

        @cache_mutex.synchronize do
          @channel_cache[channel_id] = channel_name
          @channel_cache_times[channel_id] = Time.current
        end

        return channel_name
      end

      response = slack_client.get("conversations.info") do |req|
        req.params = { channel: channel_id }
      end

      channel_name = if response.success? && response.body["ok"]
        response.body.dig("channel", "name").presence || channel_id
      else
        channel_id
      end

      @cache_mutex.synchronize do
        @channel_cache[channel_id] = channel_name
        @channel_cache_times[channel_id] = Time.current
      end

      channel_name
    end

    def slack_client
      Faraday.new(url: BASE_URL) do |conn|
        conn.request :authorization, "Bearer", ENV["SLACK_BOT_TOKEN"]
        conn.response :json, content_type: /\bjson$/
      end
    end
  end
end
