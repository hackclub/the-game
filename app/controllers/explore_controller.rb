class ExploreController < ApplicationController
  def index
    @projects = Project.where(review_status: "approved", approved: "shipped")
    @user = current_user
    render inertia: 'explore/index', props: { projects: @projects }
  end
    
end
