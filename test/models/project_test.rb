# == Schema Information
#
# Table name: projects
#
#  id                     :bigint           not null, primary key
#  approved               :integer
#  demo_link              :string
#  desc                   :text
#  hackatime_project_keys :string
#  internal_notes         :text
#  is_deleted             :boolean
#  project_type           :string
#  readme_link            :string
#  repo_link              :string
#  review_status          :integer
#  reviewer_note          :text
#  shipped                :boolean
#  submitted_at           :datetime
#  title                  :string
#  total_seconds          :integer
#  ysws                   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint           not null
#
# Indexes
#
#  index_projects_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
