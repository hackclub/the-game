class ReviewController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_reviewer

  def index
    all_queued = Project.submitted.includes(:user, :hackatime_projects, :reviews, :tags).order(submitted_at: :asc)
    queue = all_queued.first(3)
    week_reviews_by_user = Project::Review.where.not(review_type: :comment).where("created_at > ?", 1.week.ago).group(:author_id).count
    alltime_reviews_by_user = Project::Review.where.not(review_type: :comment).group(:author_id).count

    leaderboard_user_ids = (week_reviews_by_user.keys + alltime_reviews_by_user.keys).uniq
    leaderboard_users = User.where(id: leaderboard_user_ids).index_by(&:id)

    user_ids = all_queued.map(&:user_id).uniq
    balances = User.batch_balances(user_ids)

    render inertia: "review/index", props: {
      queue: queue.map { |project| project.display_hash.merge(username: project.user&.username) },
      all_queued: all_queued.map { |project| project.display_hash(notifications: false).merge(username: project.user&.username, ticket_count: balances[project.user_id] || 0) },
      queue_count: all_queued.count,
      week_leaderboard: week_reviews_by_user.map { |user_id, count| { id: user_id, name: leaderboard_users[user_id]&.username, count: count } },
      alltime_leaderboard: alltime_reviews_by_user.map { |user_id, count| { id: user_id, name: leaderboard_users[user_id]&.username, count: count } }
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
