class ReviewController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_reviewer

  def index
    all_queued = Project.submitted.includes(:user, :hackatime_projects).order(submitted_at: :asc)
    queue = all_queued.first(3)
    week_reviews_by_user = Project::Review.where.not(review_type: :comment).where("created_at > '#{1.week.ago.iso8601}'").group(:author_id).count
    alltime_reviews_by_user = Project::Review.where.not(review_type: :comment).group(:author_id).count
    render inertia: "review/index", props: {
      queue: queue.map { |project| project.display_hash.merge(username: project.user&.username) },
      all_queued: all_queued.map { |project| project.display_hash.merge(username: project.user&.username, ticket_count: project.user&.balance) },
      queue_count: all_queued.count,
      week_leaderboard: week_reviews_by_user.to_a.map { |entry| { id: entry[0], name: User.find(entry[0]).username, count: entry[1] } },
      alltime_leaderboard: alltime_reviews_by_user.to_a.map { |entry| { id: entry[0], name: User.find(entry[0]).username, count: entry[1] } }
    }
  end

  def show
    project = Project.find(params[:id])
    project_hash = project.display_hash(user: true, reviews: true, admin: current_user.admin?, reviewer: current_user.reviewer?)

    ship_versions = project.versions.where_object_changes_to(aasm_state: :submitted)
    ships = ship_versions.map.with_index do |version, index|
      diff = index == 0 ? {} : project.diff(ship_versions[index - 1].object)
      { id: version.id, date: version.created_at.to_s, diff: }
    end

    project.mark_notifications_read

    render inertia: "review/show", props: {
      project: project_hash,
      hackatime_projects: project.hackatime_projects.map(&:display_hash),
      ships:
    }
  end
end
