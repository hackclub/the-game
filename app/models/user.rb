# == Schema Information
#
# Table name: users
#
#  id                   :bigint           not null, primary key
#  account_access_token :string
#  avatar               :string
#  ban_type             :integer
#  birthday             :date
#  deleted_at           :datetime
#  email                :string           not null
#  internal_notes       :text
#  is_banned            :boolean          default(FALSE), not null
#  last_active          :datetime
#  role                 :string           default("user")
#  username             :string
#  ysws_verified        :boolean
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  account_id           :string
#  hackatime_id         :string
#  referrer_id          :bigint
#  slack_id             :string
#
# Indexes
#
#  index_users_on_deleted_at   (deleted_at)
#  index_users_on_email        (email) UNIQUE
#  index_users_on_referrer_id  (referrer_id)
#
class User < ApplicationRecord
  # Fail safe!
  def to_s
    "User##{id}"
  end

  acts_as_paranoid
  has_paper_trail

  has_many :projects
  has_many :hackatime_projects
  has_many :reviews, class_name: "Project::Review"

  # Simple referrer: a user may have one referrer (another User)
  belongs_to :referrer, class_name: "User", optional: true

  enum :ban_type, { hackatime: 0, blueprint: 1, previous: 2, slack: 3, age: 4 }
  enum :role, { user: "user", admin: "admin", reviewer: "reviewer" }

  after_save_commit :link_hackatime, if: -> { hackatime_id.nil? }
  after_save_commit :fetch_avatar, if: -> { avatar.nil? }
  after_save_commit :fetch_username, if: -> { username.nil? }

  def self.exchange_authorization_code(code, host:)
    response = Faraday.post("https://account.hackclub.com/oauth/token", { client_id: ENV["ACCOUNT_CLIENT_ID"], client_secret: ENV["ACCOUNT_CLIENT_SECRET"], redirect_uri: Rails.application.routes.url_helpers.account_callback_url(host:), code:, grant_type: "authorization_code" })

    if response.status == 200
      result = JSON.parse(response.body)
      result["access_token"]
    else
      nil
    end
  end

  def self.exchange_hackatime_code(code, host:)
    response = Faraday.post("https://hackatime.hackclub.com/oauth/token", { client_id: ENV["HACKATIME_CLIENT_ID"], client_secret: ENV["HACKATIME_CLIENT_SECRET"], redirect_uri: Rails.application.routes.url_helpers.hackatime_callback_url(host:), code:, grant_type: "authorization_code" })

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

  def self.hackatime_user_info(access_token)
    HackatimeService.authed_user_stats(access_token)
  end

  def cached_hackatime_projects
    Rails.cache.fetch("#{self.cache_key_with_version}/hackatime_projects", expires_in: 1.minute) do
      HackatimeService.sync_hackatime_projects(self).map do |hp|
        hash = hp.as_json
        hash["total_seconds"] = hp.total_seconds

        hash
      end
    end
  end

  def display_hash
    self.as_json.slice("id", "avatar", "email", "role", "username", "ysws_verified", "account_id", "hackatime_id", "slack_id")
  end

  def unassigned_hackatime_projects
    HackatimeProject.where(id: cached_hackatime_projects.map { |hp| hp["id"] }, project: nil)
  end

  private

  def self.account_client(access_token)
    Faraday.new(url: "https://account.hackclub.com/api/v1", headers: { "Authorization" => "Bearer #{access_token}" }) do |conn|
      conn.response :json, content_type: /\bjson$/
    end
  end

  def link_hackatime
    response = if slack_id.present?
      HackatimeService.fetch_user_stats(slack_id)
      # Use when we have an admin hackatime key
      # response = User.hackatime_client.get("users/lookup_slack_uid/#{slack_id}")
    else
      # Don't have an admin hackatime key yet, so we can't lookup by email.
      # User.hackatime_client.get("users/lookup_email/#{URI.encode_uri_component(user.email)}")
      nil
    end

    if response.present?
      update!(hackatime_id: response.body["data"]["user_id"])
    else
      Rails.logger.info("Failed to link hackatime")
    end
  end

  def fetch_username
    return if slack_id.blank?

    response = Faraday.get("https://cachet.dunkirk.sh/users/#{slack_id}")
    if response.success?
      data = JSON.parse(response.body)
      update(username: data["displayName"])
    end
  end

  def fetch_avatar
    return if slack_id.blank?

    response = Faraday.get("https://cachet.dunkirk.sh/users/#{slack_id}")
    if response.success?
      data = JSON.parse(response.body)
      update(avatar: data["imageUrl"])
    end
  end
end
