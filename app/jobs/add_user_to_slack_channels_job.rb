class AddUserToSlackChannelsJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find_by(id: user_id)
    return if user.nil?

    SlackChannelInviteService.invite_user(user.slack_id)
  end
end
