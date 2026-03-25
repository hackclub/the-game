class SlackUserService
  CACHE_TTL = 5.minutes

  class << self
    def fetch(slack_id)
      return if slack_id.blank? || !SlackApiService.available?

      Rails.cache.fetch("slack/users/#{slack_id}", expires_in: CACHE_TTL, skip_nil: true) do
        response = SlackApiService.client.get("users.info") do |req|
          req.params = { user: slack_id }
        end

        next unless response.success? && response.body["ok"]

        slack_user = response.body["user"] || {}
        profile = slack_user["profile"] || {}

        {
          username: slack_user["name"].presence,
          avatar_url: profile["image_72"].presence
        }.compact.presence
      end
    rescue Faraday::Error => e
      Rails.logger.warn("Failed to fetch Slack user #{slack_id}: #{e.message}")
      nil
    end

    def username(slack_id)
      fetch(slack_id)&.dig(:username)
    end

    def avatar_url(slack_id)
      fetch(slack_id)&.dig(:avatar_url)
    end
  end
end
