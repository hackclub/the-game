class AnnouncementsController < ApplicationController
  skip_after_action :verify_authorized, only: [ :image ]

  ALLOWED_IMAGE_HOST = "files.slack.com".freeze

  # Proxies a private Slack image file through the bot token so it can be
  # displayed in the browser. Restricted to logged-in users and Slack's file
  # host to avoid acting as an open proxy.
  def image
    return head :unauthorized unless user_logged_in?

    uri = begin
      URI.parse(params[:url].to_s)
    rescue URI::InvalidURIError
      nil
    end

    return head :bad_request unless uri&.scheme == "https" && uri.host == ALLOWED_IMAGE_HOST

    response = SlackApiService.fetch_file(uri.to_s)
    return head :bad_gateway unless response&.success?

    content_type = response.headers["content-type"].to_s
    return head :unsupported_media_type unless content_type.start_with?("image/")

    expires_in 1.hour, public: false
    send_data response.body, type: content_type, disposition: "inline"
  end
end
