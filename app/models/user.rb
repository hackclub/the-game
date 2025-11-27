# == Schema Information
#
# Table name: users
#
#  id                   :bigint           not null, primary key
#  account_access_token :string
#  admin                :boolean          default(FALSE), not null
#  avatar               :string
#  ban_type             :integer
#  birthday             :date
#  email                :string           not null
#  internal_notes       :text
#  is_banned            :boolean          default(FALSE), not null
#  last_active          :datetime
#  username             :string
#  ysws_verified        :boolean
#  account_id           :string
#  hackatime_id         :string
#  referrer_id          :bigint
#  slack_id             :string
#
# Indexes
#
#  index_users_on_referrer_id  (referrer_id)
#
class User < ApplicationRecord
  # Fail safe!
  def to_s
    "User##{id}"
  end

  # Simple referrer: a user may have one referrer (another User)
  belongs_to :referrer, class_name: "User", optional: true

  enum :ban_type, { hackatime: 0, blueprint: 1, previous: 2, slack: 3, age: 4 }

  after_save_commit :link_hackatime, if: -> { slack_id_previously_changed? && hackatime_id.nil? }

  has_paper_trail

  def self.exchange_authorization_code(code)
    response = Faraday.post("https://account.hackclub.com/oauth/token", { client_id: ENV["ACCOUNT_CLIENT_ID"], client_secret: ENV["ACCOUNT_CLIENT_SECRET"], redirect_uri: Rails.application.routes.url_helpers.account_callback_url, code:, grant_type: "authorization_code" })

    if response.status == 200
      result = JSON.parse(response.body)
      result["access_token"]
    else
      nil
    end
  end

  def self.account_user_info(access_token)
    response = account_client(access_token).get("me")

    if response.success?
      response.body["identity"]
    else
      nil
    end
  end

  private

  def self.account_client(access_token)
    Faraday.new(url: "https://account.hackclub.com/api/v1", headers: { "Authorization" => "Bearer #{access_token}" }) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end

  def self.hackatime_client
    Faraday.new(url: "https://hackatime.hackclub.com/api/v1", headers: { "Authorization" => "Bearer #{ENV["HACKATIME_API_KEY"]}" }) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end

  def link_hackatime
    response = if slack_id.present?
      User.hackatime_client.get("users/#{slack_id}/stats")
      # Use when we have an admin hackatime key
      # User.hackatime_client.get("users/lookup_slack_uid/#{slack_id}")
    else
      # Don't have an admin hackatime key yet, so we can't lookup by email.
      # User.hackatime_client.get("users/lookup_email/#{URI.encode_uri_component(user.email)}")
      nil
    end

    if response&.success?
      update!(hackatime_id: response.body["data"]["user_id"])
    else
      nil
    end
  end
end
