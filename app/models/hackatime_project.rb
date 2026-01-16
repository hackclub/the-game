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

  def sync_total_seconds
    hp = user.sync_hackatime_projects.detect { |p| p.name == name }
    hp.total_seconds
  end
end
