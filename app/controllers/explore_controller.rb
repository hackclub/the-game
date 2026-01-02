class ExploreController < ApplicationController
  def index
    @projects = Project.includes(:user).where(review_status: "approved", approved: "shipped")
    @user = current_user
    render inertia: 'explore/index', props: {
      projects: @projects.map { |p| p.attributes.merge(username: p.user&.username) }
    }
  end
    
end
