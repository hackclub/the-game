require "net/http"
require "json"

class PlatformAuthorizationService
  BASE_URL = ENV.fetch("PLATFORM_API_URL", nil)
  TOKEN    = ENV.fetch("PLATFORM_API_TOKEN", nil)

  def self.authorize!(user)
    return nil if BASE_URL.blank?
    raise "PLATFORM_API_TOKEN is not configured" if TOKEN.blank?

    post("/api/internal/authorize", user_payload(user))
  end

  def self.authorize_batch!(users)
    return nil if BASE_URL.blank?
    raise "PLATFORM_API_TOKEN is not configured" if TOKEN.blank?

    post("/api/internal/authorize_batch", { users: users.map { |u| user_payload(u) } })
  end

  def self.stub_hca_ids
    return [] if BASE_URL.blank?
    raise "PLATFORM_API_TOKEN is not configured" if TOKEN.blank?

    uri  = URI("#{BASE_URL}/api/internal/stub_hca_ids")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    req  = Net::HTTP::Get.new(uri, { "Authorization" => "Bearer #{TOKEN}" })
    res  = http.request(req)
    raise "Platform API error #{res.code}: #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    JSON.parse(res.body)["hca_ids"] || []
  end

  private

  def self.post(path, payload)
    uri  = URI("#{BASE_URL}#{path}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    req  = Net::HTTP::Post.new(uri.path, {
      "Content-Type"  => "application/json",
      "Authorization" => "Bearer #{TOKEN}"
    })
    req.body = payload.to_json
    res = http.request(req)
    raise "Platform API error #{res.code}: #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    JSON.parse(res.body)
  end

  def self.user_payload(user)
    full_name = [ user.first_name, user.last_name ].compact.join(" ").presence
    {
      hca_id:         user.account_id,
      email:          user.email,
      slack_id:       user.slack_id,
      name:           full_name,
      preferred_name: user.username,
      avatar_url:     user.avatar
    }.compact
  end
end
