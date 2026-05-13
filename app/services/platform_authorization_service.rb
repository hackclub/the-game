require "net/http"
require "json"

class PlatformAuthorizationService
  BASE_URL = ENV.fetch("PLATFORM_API_URL", nil)
  TOKEN    = ENV.fetch("PLATFORM_API_TOKEN", nil)
  ENDPOINT = "/api/internal/authorize"

  def self.authorize!(hca_id)
    return nil if BASE_URL.blank?
    raise "PLATFORM_API_TOKEN is not configured" if TOKEN.blank?

    uri  = URI("#{BASE_URL}#{ENDPOINT}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"

    req = Net::HTTP::Post.new(uri.path, {
      "Content-Type"  => "application/json",
      "Authorization" => "Bearer #{TOKEN}"
    })
    req.body = { hca_id: }.to_json

    res = http.request(req)
    raise "Platform API error #{res.code}: #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    JSON.parse(res.body)
  end
end
