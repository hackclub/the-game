# == Schema Information
#
# Table name: project_pending_approvals
#
#  id                  :bigint           not null, primary key
#  admin_content       :text
#  approved_seconds    :integer
#  content             :text
#  grant_golden_ticket :boolean          default(FALSE), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  author_id           :bigint           not null
#  project_id          :bigint           not null
#
# Indexes
#
#  index_project_pending_approvals_on_author_id   (author_id)
#  index_project_pending_approvals_on_project_id  (project_id)
#
class Project
  # A community reviewer's approval, held until an HQ reviewer authorizes it.
  #
  # This is deliberately NOT a Project::Review. While an approval is held it must
  # grant nothing — no tickets, no approved time, no notification, no Airtable
  # record — and the only reliable way to guarantee that is to keep it out of the
  # reviews table entirely, so every query over Project::Review keeps working
  # without remembering an "authorized" filter. On authorization the placeholder is
  # transformed into a real, published Project::Review.
  class PendingApproval < ApplicationRecord
    self.table_name = "project_pending_approvals"

    belongs_to :author, class_name: "User"
    belongs_to :project

    validates :content, :admin_content, presence: true
    validates :approved_seconds, presence: true
    validate :project_is_under_review, on: :create
    validate :no_other_pending_approval, on: :create

    # Promotes this held approval into a published Project::Review: the new review's
    # after_create_commit transitions the project to approved, notifies the author,
    # syncs to Airtable, and applies the golden ticket. The placeholder is removed
    # first so the review's "no pending approval" guard sees a clean project.
    def authorize!(authorized_by:, approved_seconds: nil)
      seconds = approved_seconds.presence || self.approved_seconds

      transaction do
        destroy!
        project.reviews.create!(
          author: author,
          authorized_by: authorized_by,
          review_type: "approval",
          content: content,
          admin_content: admin_content,
          approved_seconds: seconds,
          grant_golden_ticket: grant_golden_ticket
        )
      end
    end

    def display_hash(author: false, admin: false)
      hash = as_json.slice("id", "content", "author_id", "created_at", "project_id", "approved_seconds")
      # Shaped like a Project::Review so the frontend can render and edit it through
      # the same components; is_pending_approval routes edits to the right endpoint.
      hash["review_type"] = "approval"
      hash["is_pending_approval"] = true

      hash["author"] = self.author.display_hash if author

      if admin
        hash["admin_content"] = admin_content
        hash["grant_golden_ticket"] = grant_golden_ticket
      end

      hash
    end

    private

    def project_is_under_review
      errors.add(:base, "Project must be under review to approve") unless project&.submitted?
    end

    def no_other_pending_approval
      if project && project.pending_approvals.where.not(id: id).exists?
        errors.add(:base, "Project already has an approval awaiting HQ authorization")
      end
    end
  end
end
