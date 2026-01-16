# == Schema Information
#
# Table name: projects
#
#  id             :bigint           not null, primary key
#  approved       :integer
#  demo_link      :string
#  desc           :text
#  internal_notes :text
#  is_deleted     :boolean
#  project_type   :string
#  readme_link    :string
#  repo_link      :string
#  review_status  :integer
#  reviewer_note  :text
#  shipped        :boolean
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
#  index_projects_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Project < ApplicationRecord
  belongs_to :user
  has_paper_trail
  has_many :hackatime_projects, dependent: :destroy

  validates :title, :desc, :repo_link, :demo_link, presence: true
  validates :demo_link, format: { with: URI.regexp(%w[http https]), message: "must be a valid URL" }

  enum :review_status, { pending: 0, approved: 1, rejected: 2 }
  enum :approved, { not_shipped: 0, shipped: 1 }

  before_create :set_approved_review_status

  private

  def set_approved_review_status
    self.review_status = Project.review_statuses[:pending]
    self.approved = Project.approveds[:not_shipped]
  end
end
