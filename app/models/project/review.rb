# == Schema Information
#
# Table name: project_reviews
#
#  id          :bigint           not null, primary key
#  content     :text
#  review_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  author_id   :bigint           not null
#  project_id  :bigint           not null
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

    after_save_commit do
      if rejection?
        project.mark_rejected!
      elsif approval?
        project.mark_approved!
      end
    end

    def display_hash(author: false)
      hash = self.as_json.slice("id", "content", "review_type", "author_id")

      if author
        hash["author"] = self.author.display_hash
      end

      hash
    end
  end
end
