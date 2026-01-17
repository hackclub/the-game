class ExploreController < ApplicationController
  def index
    projects = Project.includes(:user).approved
    render inertia: "explore/index", props: {
      projects: projects.map { |p| p.display_hash.merge(username: p.user&.username) }
    }
  end
end
