class DashboardController < ApplicationController
  def index
    render inertia: {
      user: {
        id: current_user.id,
        email: current_user.email,
        username: current_user.username,
        slack_id: current_user.slack_id,
        account_linked: current_user.account_id.present?,
        hackatime_linked: current_user.hackatime_id.present?,
        admin: current_user.admin
      },
      milestones: current_user.milestones_progress,
      total_seconds: fetch_total_logged_seconds
    }
  end

  private

  def fetch_total_logged_seconds
    return 0 unless current_user.hackatime_id.present?

    project_names = current_user.projects.pluck(:hackatime_name)
    return 0 if project_names.empty?

    response = hackatime_client.get("users/#{current_user.hackatime_id}/projects/details")

    if response.success? && response.body["projects"].present?
      response.body["projects"]
        .select { |p| project_names.include?(p["name"]) }
        .sum { |p| p["total_seconds"].to_i }
    else
      0
    end
  end

  def hackatime_client
    Faraday.new(url: "https://hackatime.hackclub.com/api/v1", headers: { "Authorization" => "Bearer #{ENV["HACKATIME_API_KEY"]}" }) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end
end
