# == Schema Information
#
# Table name: projects
#
#  id               :bigint           not null, primary key
#  aasm_state       :string
#  approved_at      :datetime
#  approved_seconds :integer
#  deleted_at       :datetime
#  demo_link        :string
#  desc             :text
#  high_quality     :boolean          default(FALSE), not null
#  internal_notes   :text
#  project_type     :string
#  rejected_at      :datetime
#  repo_link        :string
#  submitted_at     :datetime
#  title            :string
#  total_seconds    :integer
#  ysws             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_projects_on_deleted_at  (deleted_at)
#  index_projects_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Project < ApplicationRecord
  DIFF_FIELDS = [ "title", "desc", "demo_link", "repo_link" ].freeze

  include AASM
  include PgSearch::Model

  pg_search_scope :search_by_title, against: :title

  acts_as_paranoid
  has_paper_trail

  REQUIRED_FIELDS = [ :title, :desc, :repo_link, :demo_link ]

  belongs_to :user
  has_many :hackatime_projects, dependent: :destroy
  has_many :reviews, class_name: "Project::Review"
  has_and_belongs_to_many :tags, join_table: :project_tags_projects, association_foreign_key: :project_tag_id
  has_one_attached :screenshot

  validates :title, :desc, presence: true
  validates :demo_link, format: { with: URI.regexp(%w[http https]), message: "must be a valid URL" }, if: -> { demo_link.present? }
  validates :repo_link, format: { with: URI.regexp(%w[http https]), message: "must be a valid URL" }, if: -> { repo_link.present? }

  aasm timestamps: true do
    state :pending, initial: true
    state :submitted
    state :approved
    state :rejected

    event :mark_submitted do
      # Approved -> submitted can happen with a re-ship
      transitions from: [ :pending, :rejected, :approved ], to: :submitted
      after do
        update!(total_seconds: reported_seconds)
      end
    end

    event :mark_approved do
      transitions from: [ :submitted, :rejected ], to: :approved
      after do
        update!(approved_seconds: total_seconds, total_seconds: nil)
        PostHog.capture({
          distinct_id: user_id.to_s,
          event: "project_approved",
          properties: { project_id: id, approved_seconds: approved_seconds, platform: "web" }
        })
      end
    end

    event :mark_rejected do
      transitions from: :submitted, to: :rejected
      after do
        update!(total_seconds: nil)
        PostHog.capture({
          distinct_id: user_id.to_s,
          event: "project_rejected",
          properties: { project_id: id, platform: "web" }
        })
      end
    end
  end

  def reported_seconds
    hackatime_projects.reduce(0) do |acc, project|
      acc + project.sync_total_seconds
    end
  end

  def in_review_seconds
    return 0 unless submitted?

    (total_seconds || 0) - (approved_seconds || 0)
  end

  def display_hash(reviews: false, user: false, admin: false, reviewer: false)
    hash = self.as_json.slice("id", "aasm_state", "approved_at", "demo_link", "desc", "rejected_at", "repo_link", "submitted_at", "title", "ysws", "created_at", "updated_at", "user_id", "high_quality")
    hash["reported_seconds"] = reported_seconds
    hash["total_seconds"] = total_seconds
    hash["approved_seconds"] = approved_seconds
    hash["real_approved_seconds"] = real_approved_seconds
    hash["hackatime_projects"] = hackatime_projects.pluck(:id)
    hash["tags"] = tags.pluck(:id)
    hash["status"] = display_status
    hash["unread_notification_count"] = unread_notifications.count

    if screenshot.attached? && screenshot.persisted?
      hash["screenshot"] = Rails.application.routes.url_helpers.rails_blob_path(screenshot, disposition: :inline)
    end

    if reviews
      if admin || reviewer
        hash["reviews"] = self.reviews.map { |review| review.display_hash(author: true, admin: true) }
      else
        hash["reviews"] = self.reviews.not_admin_only.map { |review| review.display_hash(author: true) }
      end
    end

    if user
      hash["user"] = self.user.display_hash(review: reviewer || admin)
    end

    hash
  end

  def display_status
    case aasm_state
    when "pending"
      "In progress"
    when "submitted"
      "Under review on #{submitted_at.strftime("%Y-%m-%d")}"
    when "approved"
      "Approved on #{approved_at.strftime("%Y-%m-%d")}"
    when "rejected"
      "Rejected on #{rejected_at.strftime("%Y-%m-%d")}"
    else
      "Unknown"
    end
  end

  def missing_fields
    missing = []

    REQUIRED_FIELDS.each do |field|
      unless self[field].present?
        missing.push(field.to_s.humanize.downcase)
      end
    end

    unless screenshot.attached?
      missing.push("screenshot")
    end

    unless hackatime_projects.any?
      missing.push("at least one hackatime project")
    end

    missing
  end

  def real_approved_seconds
    reviews.approval.reduce(0) { |acc, review| acc + review.approved_seconds }
  end

  def github_username
    if repo_link.present?
      uri = URI.parse(repo_link)
      uri.path.split("/").second
    end
  end

  def unread_notifications
    Notification.where(notifiable: reviews, read: false)
  end

  def mark_notifications_read
    unread_notifications.each(&:mark_read)
  end

  def diff(version)
    diffs = {}

    DIFF_FIELDS.each do |field|
      if self[field] != version[field]
        diffs[field] = [ version[field], self[field] ]
      end
    end

    diffs
  end
end
