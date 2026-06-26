require "emoji"

class SlackAnnouncementsService
  CHANNEL_ID = SlackChannels::BULLETIN
  CACHE_TTL = 5.minutes
  MAX_ANNOUNCEMENTS = 10
  IGNORED_MESSAGES = %w[
    C0A7HQZFFNX/p1775070602906179
  ].freeze

  CHANNEL_NAMES = SlackChannels::ALL.freeze
  EMOJI_CACHE_TTL = 6.hours

  @cache_mutex = Mutex.new
  @announcements_cache = nil
  @announcements_cached_at = nil
  @channel_cache = {}
  @channel_cache_times = {}
  @emoji_cache = nil
  @emoji_cached_at = nil

  class << self
    def available?
      SlackApiService.available?
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

    def block_message(ts)
      blocks = blocked_timestamps
      blocks << ts unless blocks.include?(ts)
      Rails.cache.write("slack_announcement_blocks", blocks, expires_in: 1.year)
    end

    private

    def blocked_timestamps
      Rails.cache.fetch("slack_announcement_blocks", expires_in: 1.year) { [] }
    end

    def unblock_message(ts)
      blocks = blocked_timestamps
      blocks.delete(ts)
      Rails.cache.write("slack_announcement_blocks", blocks, expires_in: 1.year)
    end

    def fetch_and_filter_messages
      response = SlackApiService.client.get("conversations.history") do |req|
        req.params = { channel: CHANNEL_ID, limit: 200 }
      end

      return [] unless response.success? && response.body["ok"]

      all_messages = response.body["messages"]
      dynamic_blocks = blocked_timestamps
      messages = []

      all_messages.each do |msg|
        next unless msg["text"]&.match?(/<!channel>|<!here>/)
        next if ignored_message?(msg["ts"])
        next if dynamic_blocks.include?(msg["ts"])

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

    def ignored_message?(ts)
      permalink_ts = "p#{ts.delete('.')}"
      IGNORED_MESSAGES.include?("#{CHANNEL_ID}/#{permalink_ts}")
    end

    def build_announcement(message)
      user = SlackUserService.fetch(message["user"]) || {}
      permalink = fetch_permalink(message["ts"])

      {
        author_name: user[:username] || "Unknown",
        author_avatar_url: user[:avatar_url],
        content: format_message(message["text"]),
        images: image_data(message),
        timestamp: Time.at(message["ts"].to_f).utc.iso8601,
        slack_ts: message["ts"],
        permalink: permalink
      }
    end

    # Maps a message's uploaded image files to proxied URLs (Slack's url_private
    # requires auth, so images go through our proxy) plus their original pixel
    # dimensions so the frontend can reserve space and avoid layout shift.
    def image_data(message)
      Array(message["files"]).filter_map do |file|
        next unless file["mimetype"].to_s.start_with?("image/")

        url = file["url_private"].presence
        next unless url

        {
          url: "/announcements/image?#{{ url: url }.to_query}",
          width: file["original_w"],
          height: file["original_h"]
        }
      end
    end

    def fetch_permalink(message_ts)
      response = SlackApiService.client.get("chat.getPermalink") do |req|
        req.params = { channel: CHANNEL_ID, message_ts: message_ts }
      end

      return nil unless response.success? && response.body["ok"]

      response.body["permalink"]
    end

    # Returns the cached { name => url/alias } map of workspace custom emoji.
    def custom_emoji
      @cache_mutex.synchronize do
        if @emoji_cache && @emoji_cached_at && @emoji_cached_at > EMOJI_CACHE_TTL.ago
          return @emoji_cache
        end
      end

      emoji = SlackApiService.fetch_emoji_list

      @cache_mutex.synchronize do
        @emoji_cache = emoji
        @emoji_cached_at = Time.current
      end

      emoji
    end

    # Resolves a custom emoji name to its image URL, following aliases.
    def custom_emoji_url(name, map)
      seen = 0
      while (value = map[name]) && value.start_with?("alias:") && seen < 5
        name = value.delete_prefix("alias:")
        seen += 1
      end

      value = map[name]
      value if value.present? && !value.start_with?("alias:")
    end

    # Replaces :shortcode: tokens with custom emoji images or Unicode characters.
    def render_emoji(text)
      map = custom_emoji

      text.gsub(/:([a-z0-9_'+-]+):/i) do
        name = $1
        url = custom_emoji_url(name, map)

        if url
          %(<img src="#{url}" alt=":#{name}:" title=":#{name}:" style="display:inline-block;height:1.25em;width:auto;vertical-align:-0.25em">)
        elsif (emoji = ::Emoji.find_by_alias(name))
          emoji.raw
        else
          ":#{name}:"
        end
      end
    end

    def format_message(text)
      return "" if text.blank?

      text = text.gsub(/<#([A-Z0-9]+)(?:\|[^>]+)?>/) { "##{fetch_channel_name($1)}" }
      text = text.gsub(/<@U[A-Z0-9]+>/, "")
      text = text.gsub(/<!channel>|<!here>|<!everyone>/, "")
      text = text.gsub(/:skin-tone-\d:/, "")
      text = render_emoji(text)
      text = text.gsub(/<(https?:\/\/[^|>]+)\|([^>]+)>/) { %(<a href="#{$1}">#{$2}</a>) }
      text = text.gsub(/<(https?:\/\/[^>]+)>/) { %(<a href="#{$1}">#{$1}</a>) }
      text = text.gsub(/\*_(.*?)_\*|_\*(.*?)\*_/) { "<strong><em>#{$1 || $2}</em></strong>" }
      text = text.gsub(/\*([^*]+)\*/) { "<strong>#{$1}</strong>" }
      text = text.gsub(/(?<!\w)_([^_]+)_(?!\w)/) { "<em>#{$1}</em>" }
      text = text.gsub(/`([^`]+)`/) { "<code>#{$1}</code>" }
      text = text.lines.map(&:strip).join("\n") # trim whitespace on each line

      # Group lines into paragraphs (a blank line starts a new paragraph) so the
      # gap between them is controlled by CSS margin rather than an empty line.
      # Single newlines stay as <br> to preserve line breaks without big gaps.
      text.split(/\n{2,}/).map(&:strip).reject(&:blank?).map do |paragraph|
        "<p>#{paragraph.gsub("\n", '<br>')}</p>"
      end.join
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

      response = SlackApiService.client.get("conversations.info") do |req|
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
  end
end
