class Project
  class ReviewsController < ApplicationController
    before_action :set_project

    def create
      if current_user.user?
        head :unauthorized
        return
      end

      skip_authorization

      @project.reviews.create!(review_params.merge(author: current_user, approved_seconds: review_params[:review_type] == "approval" ? params[:approved_hours] * 3600 : nil))

      redirect_to project_path(@project)
    end

    private

    def review_params
      params.require(:review).permit(:content, :review_type, :admin_content)
    end

    def set_project
      @project = Project.find(params[:project_id])
    end
  end
end
