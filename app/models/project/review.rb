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
    validate :project_is_under_review, on: :create

    after_save_commit do
      if rejection? && !project.rejected?
        project.mark_rejected!
      elsif approval? && !project.approved?
        project.mark_approved!
      end
    end

    after_create_commit do
      create_ysws_record if approval?
    end

    def display_hash(author: false, admin: false)
      hash = self.as_json.slice("id", "content", "review_type", "author_id", "created_at")

      if author
        hash["author"] = self.author.display_hash
      end

      if admin
        hash["admin_content"] = self.admin_content
      end

      hash
    end

    def ysws_record
      Project::Ysws.find_by(review_id: id)
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

    def project_is_under_review
      if !comment? && !project.submitted?
        errors.add(:base, "Project must be under review to approve or reject")
      end
    end

    def create_ysws_record
      ysws_project = Project::Ysws.create(
        project_id: project.id,
        review_id: id,
        first_name: author.first_name,
        last_name: author.last_name,
        email: author.email,
        github_username: project.github_username,
        address_line1: author.address_street,
        address_city: author.address_locality,
        address_state: author.address_region,
        address_country: author.address_country,
        address_postal: author.address_postal,
        birthday: author.birthday,
        name: project.title,
        description: project.desc,
        hours: approved_seconds / 3600.0,
        review_reason: admin_content,
        code_url: project.repo_link,
        playable_url: project.demo_link
      )

      ysws_project.attach_screenshot(project.screenshot)
    end
  end
end
