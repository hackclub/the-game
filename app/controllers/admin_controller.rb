class AdminController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_admin

  def index
    render inertia: "admin/index"
  end

  def announcements
    render inertia: "admin/announcements"
  end

  def projects
    render inertia: "admin/projects", props: { projects: Project.all.map { |project| project.display_hash(user: true) } }
  end

  def users
    render inertia: "admin/users", props: { users: User.all.map { |user| user.display_hash(private: true) } }
  end

  def items
    render inertia: "admin/items", props: { items: Item.all.map(&:display_hash) }
  end

  def stats
    render inertia: "admin/stats", props: { stats: Statistic.generate_statistic_data }
  end
end
