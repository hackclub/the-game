class TestController < ApplicationController
  before_action :signed_in_admin

  def index
    skip_authorization

    seed = params[:seed].presence || rand(10_000)
    per_page = 18
    current_page = (params[:page] || 1).to_i

    all_ids = Project.approved.order(:id).pluck(:id).shuffle(random: Random.new(seed.to_i))
    total_count = all_ids.size
    total_pages = (total_count.to_f / per_page).ceil
    page_ids = all_ids.slice((current_page - 1) * per_page, per_page) || []

    projects = Project.includes(:user).where(id: page_ids).index_by(&:id).values_at(*page_ids).compact

    render inertia: "test/index", props: {
      projects: projects.map { |p| p.display_hash.merge(username: p.user&.username) },
      seed:,
      pagination: {
        current_page:,
        next_page: current_page < total_pages ? current_page + 1 : nil,
        prev_page: current_page > 1 ? current_page - 1 : nil,
        total_pages:,
        total_count:
      }
    }
  end

  def project
    skip_authorization
    projects = Project.includes(:user).approved.order(approved_at: :desc).limit(6)

    render inertia: "test/project", props: {
      projects: projects.map { |p| p.display_hash.merge(username: p.user&.username) }
    }
  end
end
