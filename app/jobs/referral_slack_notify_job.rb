class ReferralSlackNotifyJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    program = ReferralProgram.instance

    referral_code = user.referral_link_code
    link = Rails.application.routes.url_helpers.root_url(host: default_host, ref: referral_code)

    message = program.slack_message_template
                     .gsub("{{user}}", user.username || user.first_name || "there")
                     .gsub("{{bonus_tickets}}", program.referred_bonus_tickets.to_s)
                     .gsub("{{link}}", link)
                     .gsub("{{referrer_percentage}}", program.referrer_bonus_percentage.to_s)

    client = Slack::Web::Client.new
    client.chat_postMessage(channel: user.slack_id, text: message)
  rescue Slack::Web::Api::Errors::SlackError => e
    Rails.logger.error("Failed to send referral Slack message to user #{user_id}: #{e.message}")
  end

  private

  def default_host
    Rails.application.routes.default_url_options[:host] || "hctg.hackclub.com"
  end
end
