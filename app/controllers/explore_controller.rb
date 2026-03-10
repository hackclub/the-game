class ExploreController < ApplicationController
  def index
    skip_authorization
    projects = Project.includes(:user).approved

    track_event("explore_viewed", {
      project_count: projects.count
    })

    render inertia: "explore/index", props: {
      projects: projects.map { |p| p.display_hash.merge(username: p.user&.username) }
    }
  end
end
