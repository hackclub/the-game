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
require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
