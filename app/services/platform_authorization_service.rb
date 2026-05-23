require "net/http"
require "json"

class PlatformAuthorizationService
  BASE_URL = ENV.fetch("PLATFORM_API_URL", nil)
  TOKEN    = ENV.fetch("PLATFORM_API_TOKEN", nil)
  ENDPOINT = "/api/internal/authorize"

  def self.authorize!(user)
    return nil if BASE_URL.blank?
    raise "PLATFORM_API_TOKEN is not configured" if TOKEN.blank?

    uri  = URI("#{BASE_URL}#{ENDPOINT}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"

    req = Net::HTTP::Post.new(uri.path, {
      "Content-Type"  => "application/json",
      "Authorization" => "Bearer #{TOKEN}"
    })
    full_name = [ user.first_name, user.last_name ].compact.join(" ").presence
    req.body = {
      hca_id:         user.account_id,
      email:          user.email,
      slack_id:       user.slack_id,
      name:           full_name,
      preferred_name: user.username,
      avatar_url:     user.avatar
    }.compact.to_json

    res = http.request(req)
    raise "Platform API error #{res.code}: #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    JSON.parse(res.body)
  end
end
