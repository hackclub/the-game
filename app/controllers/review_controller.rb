class ReviewController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_reviewer

  def index
    queue = Project.submitted.order(submitted_at: :asc).first(3)
    week_reviews_by_user = Project::Review.where.not(review_type: :comment).where("created_at > '#{1.week.ago.iso8601}'").group(:author_id).count
    alltime_reviews_by_user = Project::Review.where.not(review_type: :comment).group(:author_id).count
    render inertia: "review/index", props: {
      queue: queue.map { |project| project.display_hash.merge(username: project.user&.username) },
      week_leaderboard: week_reviews_by_user.to_a.map { |entry| { id: entry[0], name: User.find(entry[0]).username, count: entry[1] } },
      alltime_leaderboard: alltime_reviews_by_user.to_a.map { |entry| { id: entry[0], name: User.find(entry[0]).username, count: entry[1] } }
    }
  end
end
