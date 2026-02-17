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
    filtered_projects = Project.all

    if params[:status].present?
      filtered_projects = filtered_projects.where(aasm_state: params[:status])
    end

    if params[:q].present?
      filtered_projects = filtered_projects.search_by_title(params[:q])
    end

    paginated_projects = filtered_projects.order(created_at: :desc).page(params[:page]).per(10)
    render inertia: "admin/projects", props: {
      projects: paginated_projects.map { |project| project.display_hash(user: true) },
      q: params[:q],
      status: params[:status],
      pagination: {
        current_page: paginated_projects.current_page,
        next_page: paginated_projects.next_page,
        prev_page: paginated_projects.prev_page,
        total_pages: paginated_projects.total_pages,
        total_count: paginated_projects.total_count
      }
    }
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
