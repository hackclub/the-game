class ExploreController < ApplicationController
  def index
    @projects = Project.all
    @user = current_user
    render inertia: 'explore/index', props: { projects: @projects, user: @user }
  end
end
