# == Schema Information
#
# Table name: projects
#
#  id             :bigint           not null, primary key
#  aasm_state     :string
#  approved_at    :datetime
#  deleted_at     :datetime
#  demo_link      :string
#  desc           :text
#  internal_notes :text
#  project_type   :string
#  rejected_at    :datetime
#  repo_link      :string
#  submitted_at   :datetime
#  title          :string
#  total_seconds  :integer
#  ysws           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :bigint           not null
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

  belongs_to :user
  has_many :hackatime_projects, dependent: :destroy

  validates :title, :desc, :repo_link, :demo_link, presence: true
  validates :demo_link, format: { with: URI.regexp(%w[http https]), message: "must be a valid URL" }

  aasm timestamps: true do
    state :pending, initial: true
    state :submitted
    state :approved
    state :rejected

    event :mark_submitted do
      transitions from: [ :pending, :rejected ], to: :submitted
    end
  end

  def display_seconds
    return total_seconds if total_seconds.present?

    hackatime_projects.reduce(0) do |acc, project|
      acc + project.sync_total_seconds
    end
  end

  def display_hash
    hash = self.as_json.slice("id", "aasm_state", "approved_at", "demo_link", "desc", "rejected_at", "repo_link", "submitted_at", "title", "ysws", "created_at", "updated_at")
    hash["total_seconds"] = display_seconds
    hash["hackatime_projects"] = hackatime_projects.pluck(:id)

    hash
  end
end
