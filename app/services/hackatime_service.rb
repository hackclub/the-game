 class HackatimeService
   BASE_URL = "https://hackatime.hackclub.com/api/v1"


   def self.link_hackatime(id, user)
   response = hackatime_client.get("users/#{id}/stats")
   response if response&.success?
   end

   def self.sync_hackatime_projects(user)
   response = hackatime_client.get("users/#{user.slack_id}/stats") do |req|
     req.params = {
       filter_by_project: "inf-expr",
       start_date: "2024-12-23T00:00:00Z",
       end_date: Time.now.utc.iso8601,
       features: "projects"
     }
     puts req.params
   end
   if response.success?
     response = response.body["data"]["projects"]
     projects = response.map do |project|
       Rails.logger.info("Project: #{project["name"]}")
       hackatime_project = user.hackatime_projects.find_or_create_by!(name: project["name"])
       # hackatime_project
     end
   else
     nil
   end
   end

   def self.hackatime_client
     Faraday.new(url: BASE_URL, headers: { "Authorization" => "Bearer #{ENV['HACKATIME_API_KEY']}" }) do |conn|
     conn.response :json, content_type: /\bjson$/
     end
 end
 end
