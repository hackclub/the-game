class NotificationsController < ApplicationController
  def index
    skip_authorization
    notifications = current_user.notifications.order(created_at: :desc).map { |notification| notification.display_hash(notifiable: true) }
    render inertia: "notifications/index", props: { notifications: }
  end
end
