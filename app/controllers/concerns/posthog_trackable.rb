# frozen_string_literal: true

module PosthogTrackable
  extend ActiveSupport::Concern

  private

  def track_event(event, properties = {})
    return unless current_user

    PostHog.capture({
      distinct_id: current_user.id.to_s,
      event:,
      properties: properties.merge(
        environment: Rails.env,
        platform: "web"
      )
    })
  end
end
