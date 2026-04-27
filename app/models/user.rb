# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  account_access_token   :string
#  address_country        :string
#  address_locality       :string
#  address_postal         :string
#  address_region         :string
#  address_street         :string
#  avatar                 :string
#  ban_type               :integer
#  birthday               :date
#  deleted_at             :datetime
#  email                  :string           not null
#  first_name             :string
#  hackatime_access_token :string
#  internal_notes         :text
#  is_banned              :boolean          default(FALSE), not null
#  last_active            :datetime
#  last_name              :string
#  onboarding_completed   :boolean          default(FALSE), not null
#  referral_code          :string
#  role                   :string           default("user")
#  username               :string
#  verification_status    :string
#  ysws_verified          :boolean
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :string
#  hackatime_id           :string
#  referrer_id            :bigint
#  slack_id               :string
#
# Indexes
#
#  index_users_on_deleted_at   (deleted_at)
#  index_users_on_email        (email) UNIQUE
#  index_users_on_referrer_id  (referrer_id)
#
class User < ApplicationRecord
  include SwrCacheable

  VERIFIED_VERIFICATION_STATUSES = %w[verified verified_eligible verified_but_over_18].freeze

  def self.normalized_username(value)
    value.to_s.strip.delete_prefix("@").presence
  end

  def self.fetch_username_from_slack(slack_id)
    normalized_username(SlackUserService.username(slack_id))
  end

  # Fail safe!
  def to_s
    "User##{id}"
  end

  include PgSearch::Model

  pg_search_scope :search_by_name, against: [ :username, :first_name, :last_name, :email ]

  acts_as_paranoid
  has_paper_trail

  has_many :projects
  has_many :hackatime_projects
  has_many :reviews, class_name: "Project::Review"
  has_many :purchases, class_name: "Item::Purchase"
  has_many :items, through: :purchases
  has_many :notifications
  has_many :ticket_adjustments
  has_many :incoming_ticket_transfers, foreign_key: :to_user_id, class_name: "TicketTransfer"
  has_many :outgoing_ticket_transfers, foreign_key: :from_user_id, class_name: "TicketTransfer"
  has_many :referrals, foreign_key: :referrer_id
  has_many :referred_users, through: :referrals, source: :referred_user

  has_many :approved_reviews, -> { where(review_type: :approval) }, through: :projects, source: :reviews, class_name: "Project::Review"

  encrypts :account_access_token
  encrypts :hackatime_access_token

  # Simple referrer: a user may have one referrer (another User)
  belongs_to :referrer, class_name: "User", optional: true

  enum :ban_type, { hackatime: 0, blueprint: 1, previous: 2, slack: 3, age: 4 }
  enum :role, { user: "user", admin: "admin", reviewer: "reviewer" }

  after_save_commit :link_hackatime, if: -> { slack_id_previously_changed? && hackatime_id.nil? }
  after_save_commit :fetch_avatar, if: -> { avatar.nil? }
  after_save_commit :fetch_username, if: -> { username.nil? }
  after_save_commit :sync_referral_verification, if: -> { verification_status_previously_changed? }
  after_save_commit :sync_pyramid_record, if: -> { referral_code_previously_changed? }
  after_save_commit :sync_airtable_record

  def self.exchange_hackatime_code(code, host:)
    response = Faraday.post("https://hackatime.hackclub.com/oauth/token", { client_id: ENV["HACKATIME_CLIENT_ID"], client_secret: ENV["HACKATIME_CLIENT_SECRET"], redirect_uri: Rails.application.routes.url_helpers.hackatime_callback_url(host:), code:, grant_type: "authorization_code" })

    if response.status == 200
      result = JSON.parse(response.body)
      result["access_token"]
    else
      nil
    end
  end

  def self.hackatime_user_info(access_token)
    HackatimeService.authed_user_stats(access_token)
  end

  def cached_hackatime_projects
    swr_cache("#{self.cache_key_with_version}/hackatime_projects", stale_after: 1.minute, max_ttl: 1.1.hours, fetcher: :fetch_hackatime_projects) { fetch_hackatime_projects }
  end

  def fetch_hackatime_projects
    HackatimeService.sync_hackatime_projects(self).map do |hp|
      hash = hp.as_json
      hash["total_seconds"] = hp.total_seconds

      hash
    end
  end

  def display_hash(private: false, review: false)
    if private
      hash = self.as_json.slice("id", "first_name", "last_name", "github_username", "address_street", "address_locality", "address_region", "address_country", "address_postal", "birthday", "avatar", "email", "role", "username", "ysws_verified", "verification_status", "account_id", "hackatime_id", "slack_id", "onboarding_completed")
      hash["balance"] = self.balance
      hash["total_reported_seconds"] = self.total_reported_seconds
      hash["total_in_review_seconds"] = self.total_in_review_seconds
      hash["total_approved_seconds"] = self.total_approved_seconds
      hash["ticket_adjustments"] = self.ticket_adjustments.order(created_at: :desc).map(&:display_hash)
      hash["incoming_ticket_transfers"] = self.incoming_ticket_transfers.order(created_at: :desc).map(&:display_hash)
      hash["outgoing_ticket_transfers"] = self.outgoing_ticket_transfers.order(created_at: :desc).map(&:display_hash)
      hash["wizard"] = self.wizard?
      hash["can_overspend"] = self.can_overspend

      hash
    elsif review
      self.as_json.slice("id", "avatar", "role", "username", "email", "hackatime_id", "slack_id", "verification_status")
    else
      self.as_json.slice("id", "avatar", "role", "username")
    end
  end

  def unassigned_hackatime_projects
    HackatimeProject.where(id: cached_hackatime_projects.map { |hp| hp["id"] }, project: nil)
  end

  def idv_verified?
    self.class.verified_verification_statuses.include?(verification_status)
  end

  def refresh_verification_status!
    return if account_id.blank?

    response = Faraday.get(
      "#{ENV.fetch('HCA_URL', 'https://auth.hackclub.com')}/api/external/check",
      { idv_id: account_id }
    )

    return unless response.success?

    data = JSON.parse(response.body)
    status = self.class.normalized_verification_status(data["result"])

    updates = {}
    updates[:verification_status] = status if status.present?

    # Sync address if available
    if data["address"].present?
      updates[:address_street] = data["address"]["street_address"]
      updates[:address_locality] = data["address"]["locality"]
      updates[:address_region] = data["address"]["region"]
      updates[:address_postal] = data["address"]["postal_code"]
      updates[:address_country] = data["address"]["country"]
    end

    # Sync other identity fields if present and possibly missing locally
    updates[:first_name] = data["given_name"] if data["given_name"].present?
    updates[:last_name] = data["family_name"] if data["family_name"].present?
    updates[:birthday] = data["birthdate"] if data["birthdate"].present?

    update!(updates) if updates.any?
  rescue Faraday::Error, JSON::ParserError => e
    Rails.logger.warn("Failed to refresh verification status for User##{id}: #{e.message}")
  end

  def self.normalized_verification_status(status)
    return "verified" if verified_verification_statuses.include?(status)

    status
  end

  def self.verified_verification_statuses
    VERIFIED_VERIFICATION_STATUSES
  end

  def sync_pyramid_record
    data = { email:, referral_code:, projects_count: projects.count, idv_status: verification_status, hours: (total_reported_seconds / 3600.00) }

    if pyramid_record.nil?
      Pyramid.create(data)
    else
      pyramid_record.update(data)
    end
  end

  def sync_airtable_record
    return if User::Airtable.airtable_optional_env? && !User::Airtable.airtable_enabled?

    first_project = projects.order(:created_at).first
    first_shipped_project = projects.where.not(submitted_at: nil).order(:submitted_at).first

    data = {
      email: email,
      first_name: first_name.presence || username,
      address_line1: address_street,
      address_city: address_locality,
      address_state: address_region,
      address_country: address_country,
      address_postal: address_postal,
      verification_status: verification_status,
      hackatime_linked: hackatime_id.present?,
      first_project_created_at: first_project&.created_at,
      first_project_ship_at: first_shipped_project&.submitted_at
    }

    record = airtable_record || User::Airtable.new(email: email)
    record.update(data)
  end

  def pyramid_record
    Pyramid.find_by(email:)
  end

  def airtable_record
    return nil if User::Airtable.airtable_optional_env? && !User::Airtable.airtable_enabled?

    User::Airtable.find_by(email: email)
  end

  def total_reported_seconds
    projects.includes(:hackatime_projects).reduce(0) { |acc, project| acc + project.reported_seconds }
  end

  def total_in_review_seconds
    projects.submitted.reduce(0) { |acc, project| acc + project.in_review_seconds }
  end

  def total_ever_submitted_seconds
    total_in_review_seconds + total_reviewed_seconds
  end

  def total_reviewed_seconds
    projects.reduce(0) { |acc, project| acc + (project.approved_seconds || 0) }
  end

  def total_approved_seconds
    projects.reduce(0) { |acc, project| acc + project.real_approved_seconds }
  end

  def balance
    revenue = ((approved_reviews.reduce(0) { |acc, review| acc + review.approved_seconds }) / 3600.0).floor
    expenses = purchases.reduce(0) { |acc, purchase| acc + (purchase.amount_paid) }
    adjustments = ticket_adjustments.reduce(0) { |acc, adjustment | acc + adjustment.amount }
    incoming_transfers = incoming_ticket_transfers.reduce(0) { |acc, transfer| acc + transfer.amount }
    outgoing_transfers = outgoing_ticket_transfers.reduce(0) { |acc, transfer| acc + transfer.amount }

    revenue + adjustments - expenses + incoming_transfers - outgoing_transfers
  end

  def mark_adjustment_notifications_read
    unread_adjustment_notifications.each(&:mark_read)
  end

  def unread_adjustment_notifications
    Notification.where(notifiable: ticket_adjustments, read: false)
  end

  def referral_link_code
    @referral_link_code ||= Digest::SHA256.hexdigest("referral-#{id}-#{created_at}")[0, 8]
  end

  def wizard?
    admin? || projects.any?(&:high_quality)
  end

  private

  def sync_referral_verification
    ReferralRewardService.sync_verification(self)
  end

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
    end
  end

  def fetch_username
    username = self.class.fetch_username_from_slack(slack_id)
    update(username:) if username.present?
  end

  def fetch_avatar
    avatar_url = SlackUserService.avatar_url(slack_id)
    update(avatar: avatar_url) if avatar_url.present?
  end
end
