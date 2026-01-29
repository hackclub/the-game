class Project
  class ReviewsController < ApplicationController
    def create
      if current_user.user?
        head :unauthorized
        return
      end

      Project::Review.create!(review_params)

      redirect_to admin_projects_path
    end

    private

    def review_params
      params.require(:review).permit(:content, :review_status, :project_id)
    end
  end
end
