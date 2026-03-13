# == Schema Information
#
# Table name: project_tags
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Project
  class Tag < ApplicationRecord
    has_and_belongs_to_many :projects, foreign_key: :project_tag_id, inverse_of: :tags

    def display_hash
      self.as_json.slice("id", "name", "created_at")
    end
  end
end
