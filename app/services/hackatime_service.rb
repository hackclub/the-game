class HackatimeService
  BASE_URL = "https://hackatime.hackclub.com/api/v1"

  # The start of the current season. Hackatime time tracked before this date is
  # not counted towards the game.
  SEASON_START = "2025-12-23T00:00:00Z".freeze

  def self.fetch_user_stats(id)
    response = hackatime_client.get("users/#{id}/stats")
    response if response&.success?
  end

  def self.sync_hackatime_projects(user)
    raw_projects = []

    if user.hackatime_access_token.present?
      response = hackatime_client.get("authenticated/projects") do |req|
        req.headers["Authorization"] = "Bearer #{user.hackatime_access_token}"
        req.params = {
          start_date: SEASON_START,
          end_date: Time.now.utc.iso8601
        }
      end

      if response.success?
        raw_projects = response.body["projects"]
      end
    else
      response = hackatime_client.get("users/#{user.hackatime_id}/stats") do |req|
        req.params = {
          start_date: SEASON_START,
          end_date: Time.now.utc.iso8601,
          features: "projects"
        }
      end

      if response.success?
        raw_projects = response.body["data"]["projects"]
      end
    end

    raw_projects.map do |project|
      # Hackatime reports projects that have an unknown name as "Other" - this cannot be submitted
      next if project["name"] == "Other"

      db_project = user.hackatime_projects.find_or_create_by!(name: project["name"])
      db_project.total_seconds = project["total_seconds"]

      db_project
    end.compact
  end

  def self.authed_user_stats(access_token)
    response = hackatime_client.get("authenticated/me") do |req|
      req.headers["Authorization"] = "Bearer #{access_token}"
    end

    response if response&.success?
  end

  # Fetches per-project details for a single user, scoped to the current season.
  # Returns an array of project hashes — each with "name", "total_seconds" and
  # "most_recent_heartbeat" (an ISO8601 timestamp) — or nil if the data could
  # not be retrieved.
  #
  # Prefers the public stats lookup (works for any user with public stats
  # enabled, by Slack UID or Hackatime user id) and falls back to the
  # authenticated endpoint when the user has disabled public stats but we hold
  # their access token. Safe to call concurrently from multiple threads.
  def self.fetch_project_details(identifier:, access_token: nil)
    if identifier.present?
      response = hackatime_client.get("users/#{identifier}/projects/details") do |req|
        req.params = { start_date: SEASON_START }
        req.options.open_timeout = 8
        req.options.timeout = 15
      end
      return response.body["projects"] if response.success? && response.body.is_a?(Hash)
      # A 403 means the user disabled public stats; fall through to the token path.
    end

    if access_token.present?
      response = hackatime_client.get("authenticated/projects") do |req|
        req.headers["Authorization"] = "Bearer #{access_token}"
        req.params = { start_date: SEASON_START, end_date: Time.now.utc.iso8601 }
        req.options.open_timeout = 8
        req.options.timeout = 15
      end
      return response.body["projects"] if response.success? && response.body.is_a?(Hash)
    end

    nil
  rescue Faraday::Error
    nil
  end

  def self.hackatime_client
    Faraday.new(url: BASE_URL) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
