class ExploreController < ApplicationController
  def index
    skip_authorization
    projects = Project.includes(:user).approved
    paginated_projects = projects.order(approved_at: :desc).page(params[:page]).per(18)

    track_event("explore_viewed", {
      project_count: paginated_projects.count
    })

    render inertia: "explore/index", props: {
      projects: paginated_projects.map { |p| p.display_hash.merge(username: p.user&.username) },
      pagination: {
        current_page: paginated_projects.current_page,
        next_page: paginated_projects.next_page,
        prev_page: paginated_projects.prev_page,
        total_pages: paginated_projects.total_pages,
        total_count: paginated_projects.total_count
      }
    }
  end
end
