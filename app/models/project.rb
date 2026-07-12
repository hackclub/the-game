# == Schema Information
#
# Table name: projects
#
#  id                   :bigint           not null, primary key
#  aasm_state           :string
#  ai_declaration       :text
#  approved_at          :datetime
#  approved_seconds     :integer
#  deleted_at           :datetime
#  demo_link            :string
#  desc                 :text
#  high_quality         :boolean          default(FALSE), not null
#  internal_notes       :text
#  project_type         :string
#  rejected_at          :datetime
#  repo_link            :string
#  reship_allowed_at    :datetime
#  submitted_at         :datetime
#  title                :string
#  total_seconds        :integer
#  ysws                 :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  reship_allowed_by_id :bigint
#  user_id              :bigint           not null
#
# Indexes
#
#  index_projects_on_deleted_at            (deleted_at)
#  index_projects_on_reship_allowed_by_id  (reship_allowed_by_id)
#  index_projects_on_user_id               (user_id)
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
  scope :high_quality, -> { where(high_quality: true) }

  # Submitted projects that a reviewer may still place a verdict on: no approval
  # is currently waiting on HQ authorization.
  scope :awaiting_review, -> { submitted.where.not(id: Project::PendingApproval.select(:project_id)) }
  # Submitted projects whose community approval is held pending HQ authorization.
  scope :pending_hq_review, -> { submitted.where(id: Project::PendingApproval.select(:project_id)) }

  acts_as_paranoid
  has_paper_trail

  REQUIRED_FIELDS = [ :title, :desc, :repo_link, :demo_link ]

  belongs_to :user
  belongs_to :reship_allowed_by, class_name: "User", optional: true
  has_many :hackatime_projects, dependent: :destroy

  after_create_commit :sync_user_airtable_if_first_project
  after_update_commit :sync_user_airtable_if_first_ship
  has_many :reviews, class_name: "Project::Review"
  has_many :pending_approvals, class_name: "Project::PendingApproval", dependent: :destroy
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
        # Each approval requires a fresh, explicit reship allowance from a
        # reviewer - any allowance granted before this approval no longer applies.
        update!(approved_seconds: total_seconds, total_seconds: nil, reship_allowed_at: nil, reship_allowed_by_id: nil)
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
        # Each rejection requires a fresh, explicit reship allowance from a
        # reviewer - any allowance granted before this rejection no longer applies.
        update!(total_seconds: nil, reship_allowed_at: nil, reship_allowed_by_id: nil)
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

  def display_hash(reviews: false, user: false, admin: false, reviewer: false, notifications: true, raw_seconds: false)
    hash = self.as_json.slice("id", "aasm_state", "approved_at", "demo_link", "desc", "rejected_at", "repo_link", "submitted_at", "title", "ysws", "created_at", "updated_at", "user_id", "high_quality", "ai_declaration")
    hash["reported_seconds"] = raw_seconds ? (total_seconds || approved_seconds || 0) : reported_seconds
    hash["total_seconds"] = total_seconds
    hash["approved_seconds"] = approved_seconds
    hash["real_approved_seconds"] = real_approved_seconds
    hash["hackatime_projects"] = hackatime_projects.loaded? ? hackatime_projects.map(&:id) : hackatime_projects.pluck(:id)
    hash["tags"] = tags.loaded? ? tags.map(&:id) : tags.pluck(:id)
    hash["status"] = display_status
    hash["reship_allowed"] = reship_allowed?
    hash["reship_gate_active"] = reship_gate_active?
    hash["needs_reship_allowance"] = needs_reship_allowance?
    hash["approved_reship_gate_active"] = approved_reship_gate_active?
    # Only computed where it's actually consumed (review/manage views, which either
    # request reviews or eager-load them); skipping it avoids a per-row pending
    # existence query on list pages that never read the flag.
    hash["pending_hq"] = pending_hq? if reviews || self.reviews.loaded?
    hash["unread_notification_count"] = notifications ? unread_notifications.count : 0

    if screenshot.attached? && screenshot.persisted?
      hash["screenshot"] = "/rails/active_storage/blobs/redirect/#{screenshot.blob.signed_id}/#{screenshot.blob.filename}"
    end

    if reviews
      if admin || reviewer
        hash["reviews"] = self.reviews.map { |review| review.display_hash(author: true, admin: true) }
        # The held approval is only ever surfaced to reviewers/HQ; it stays invisible
        # to the author until it is authorized and becomes a real review.
        hash["pending_approval"] = pending_approval&.display_hash(author: true, admin: true)
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

  # Projects rejected before this were rejected under the old rules (freely
  # reshippable) and are grandfathered in - only rejections from this point on
  # require an explicit reviewer reship allowance.
  RESHIP_GATE_STARTS_AT = Time.parse("2026-07-10 08:22:00 UTC").freeze

  def reship_allowed?
    reship_allowed_at.present?
  end

  # Whether this project is subject to the reship-allowance gate at all - false
  # for projects rejected before the gate existed, so they're treated like the
  # feature was never added (still subject to the platform-wide toggle though).
  def reship_gate_active?
    rejected? && rejected_at.present? && rejected_at >= RESHIP_GATE_STARTS_AT
  end

  def needs_reship_allowance?
    reship_gate_active? && !reship_allowed?
  end

  # Whether an approved project should offer reviewers an "Allow Reship" control -
  # only relevant while platform-wide shipping is closed, since an approved
  # project can otherwise already be reshipped without any explicit allowance.
  # Stays true once granted (even if shipping later reopens) so the "cleared"
  # state remains visible until the project moves out of the approved state.
  def approved_reship_gate_active?
    approved? && (!PlatformSetting.instance.shipping_enabled? || reship_allowed?)
  end

  def allow_reship!(user)
    update!(reship_allowed_at: Time.current, reship_allowed_by_id: user.id)
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

  # The single held community approval awaiting HQ authorization, if any. At most
  # one can exist at a time (PendingApproval guards against a second).
  def pending_approval
    pending_approvals.loaded? ? pending_approvals.first : pending_approvals.order(:created_at).first
  end

  # True when a community reviewer has approved but an HQ reviewer has not yet
  # authorized the approval (the project is still under review for the author).
  def pending_hq?
    pending_approvals.loaded? ? pending_approvals.any? : pending_approvals.exists?
  end

  def real_approved_seconds
    if reviews.loaded?
      reviews.select { |r| r.review_type == "approval" }.sum(&:approved_seconds)
    else
      reviews.approval.sum(:approved_seconds)
    end
  end

  def github_username
    if repo_link.present?
      uri = URI.parse(repo_link)
      uri.path.split("/").second
    end
  end

  def unread_notifications
    Notification.where(notifiable: reviews.with_deleted, read: false)
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

  private

  def sync_user_airtable_if_first_project
    user.sync_airtable_record if user.projects.count == 1
  end

  def sync_user_airtable_if_first_ship
    return unless submitted_at_previously_changed? && submitted_at_previously_was.nil?

    user.sync_airtable_record if user.projects.where.not(submitted_at: nil).count == 1
  end
end
