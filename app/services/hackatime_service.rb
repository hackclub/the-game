class HackatimeService
  BASE_URL = "https://hackatime.hackclub.com/api/v1"

  def self.fetch_user_stats(id)
    response = hackatime_client.get("users/#{id}/stats")
    response if response&.success?
  end

  def self.sync_hackatime_projects(user)
    projects = []

    response = hackatime_client.get("users/#{user.slack_id}/stats") do |req|
      req.params = {
        filter_by_project: "inf-expr",
        start_date: "2025-12-23T00:00:00Z",
        end_date: Time.now.utc.iso8601,
        features: "projects"
      }
    end

    if response.success?
      projects = response.body["data"]["projects"].map do |project|
        db_project = user.hackatime_projects.find_or_create_by!(name: project["name"])
        db_project.total_seconds = project["total_seconds"]

        db_project
      end
    else
      nil
    end

    projects
  end

  def self.hackatime_client
    Faraday.new(url: BASE_URL) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
