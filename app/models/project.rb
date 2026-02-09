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
  include AASM
  acts_as_paranoid
  has_paper_trail

  REQUIRED_FIELDS = [ :title, :desc, :repo_link, :demo_link ]

  belongs_to :user
  has_many :hackatime_projects, dependent: :destroy
  has_many :reviews, class_name: "Project::Review"
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
      end
    end

    event :mark_rejected do
      transitions from: :submitted, to: :rejected
      after do
        update!(total_seconds: nil)
      end
    end
  end

  def display_seconds
    return approved_seconds if approved_seconds.present? && approved?
    return total_seconds if total_seconds.present?
    reported_seconds
  end

  def reported_seconds
    hackatime_projects.reduce(0) do |acc, project|
      acc + project.sync_total_seconds
    end
  end

  def display_hash(reviews: false, user: false)
    hash = self.as_json.slice("id", "aasm_state", "approved_at", "demo_link", "desc", "rejected_at", "repo_link", "submitted_at", "title", "ysws", "created_at", "updated_at", "user_id")
    hash["total_seconds"] = display_seconds
    hash["reported_seconds"] = reported_seconds
    hash["hackatime_projects"] = hackatime_projects.pluck(:id)
    hash["status"] = display_status

    if screenshot.attached? && screenshot.persisted?
      hash["screenshot"] = Rails.application.routes.url_helpers.rails_blob_path(screenshot, disposition: :inline)
    end

    if reviews
      hash["reviews"] = self.reviews.map { |review| review.display_hash(author: true) }
    end

    if user
      hash["user"] = self.user.display_hash
    end

    hash
  end

  def display_status
    case aasm_state
    when "pending"
      "In progress"
    when "submitted"
      "Under review"
    when "approved"
      "Approved!"
    when "rejected"
      "Rejected"
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
end
