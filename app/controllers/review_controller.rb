class ReviewController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_reviewer

  def index
    queue = Project.submitted.order(submitted_at: :asc).first(3)
    render inertia: "review/index", props: {
      queue: queue.map { |project| project.display_hash.merge(username: project.user&.username) }
    }
  end
end
