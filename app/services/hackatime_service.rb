class HackatimeService
  BASE_URL = "https://hackatime.hackclub.com/api/v1"

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
          start_date: "2025-12-23T00:00:00Z",
          end_date: Time.now.utc.iso8601
        }
      end

      if response.success?
        raw_projects = response.body["projects"]
      end
    else
      response = hackatime_client.get("users/#{user.hackatime_id}/stats") do |req|
        req.params = {
          start_date: "2025-12-23T00:00:00Z",
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

  def self.hackatime_client
    Faraday.new(url: BASE_URL) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
