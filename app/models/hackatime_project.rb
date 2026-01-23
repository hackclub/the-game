# == Schema Information
#
# Table name: hackatime_projects
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint
#  user_id    :bigint           not null
#
# Indexes
#
#  index_hackatime_projects_on_project_id  (project_id)
#  index_hackatime_projects_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class HackatimeProject < ApplicationRecord
  belongs_to :project, optional: true
  belongs_to :user

  attr_accessor :total_seconds

  def self.sync_total_seconds(hash)
    hp = User.find(hash["user_id"]).cached_hackatime_projects.detect { |p| p["name"] == hash["name"] }
    hp.present? ? hp["total_seconds"] : 0
  end

  def self.display_hash(hash)
    hash.slice("id", "name", "total_seconds")
  end

  def sync_total_seconds
    HackatimeProject.sync_total_seconds(self.as_json)
  end

  def display_hash
    hash = self.as_json
    hash["total_seconds"] = HackatimeProject.sync_total_seconds(hash)
    HackatimeProject.display_hash(hash)
  end
end
