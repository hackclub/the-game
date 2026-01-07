class ExploreController < ApplicationController
  def index
    projects = Project.includes(:user).where(review_status: "approved", approved: "shipped")
    render inertia: "explore/index", props: {
      projects: projects.map { |p| p.attributes.merge(username: p.user&.username) }
    }
  end
end
