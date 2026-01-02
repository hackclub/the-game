class ExploreController < ApplicationController
  def index
    @projects = Project.all
    render inertia: 'explore/index', props: { projects: @projects }
  end
    
end
