# == Schema Information
#
# Table name: project_reviews
#
#  id               :bigint           not null, primary key
#  admin_content    :text
#  approved_seconds :integer
#  content          :text
#  review_type      :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  author_id        :bigint           not null
#  project_id       :bigint           not null
#
# Indexes
#
#  index_project_reviews_on_author_id   (author_id)
#  index_project_reviews_on_project_id  (project_id)
#
class Project
  class Review < ApplicationRecord
    belongs_to :author, class_name: "User"
    belongs_to :project

    enum :review_type, { comment: "comment", rejection: "rejection", approval: "approval" }

    scope :not_admin_only, -> { where.not(content: nil).where.not(content: "") }

    validate :non_comments_have_justification
    validate :only_approvals_have_seconds

    after_save_commit do
      if rejection? && !project.rejected?
        project.mark_rejected!
      elsif approval? && !project.approved?
        project.mark_approved!
      end
    end

    def display_hash(author: false, admin: false)
      hash = self.as_json.slice("id", "content", "review_type", "author_id")

      if author
        hash["author"] = self.author.display_hash
      end

      if admin
        hash["admin_content"] = self.admin_content
      end

      hash
    end

    private

    def non_comments_have_justification
      if (!content.present? || !admin_content.present?) && !comment?
        errors.add(:base, "Approvals and rejections must have user comments and justification")
      end
    end

    def only_approvals_have_seconds
      if approval? && approved_seconds.nil?
        errors.add(:base, "Approvals must include approved_seconds")
      end

      if !approval? && approved_seconds.present?
        errors.add(:base, "Only approvals can include approved_seconds")
      end
    end
  end
end
