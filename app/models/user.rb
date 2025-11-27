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
#  github_username      :string
#  internal_notes       :text
#  is_banned            :boolean          default(FALSE), not null
#  is_pro               :boolean          default(FALSE)
#  last_active          :datetime
#  timezone_raw         :string
#  username             :string
#  ysws_verified        :boolean
#  account_id           :string
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

  validates :is_banned, inclusion: { in: [ true, false ] }
  after_commit :advance_projects_after_idv!, on: :update, if: -> { previous_changes.key?("ysws_verified") && ysws_verified? }

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

    if response.status == 200
      JSON.parse(response.body)["identity"]
    else
      nil
    end
  end

  def self.account_client(access_token)
    Faraday.new(url: "https://account.hackclub.com/api/v1", headers: { "Authorization" => "Bearer #{access_token}" })
  end
end
