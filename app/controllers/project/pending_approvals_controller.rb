class Project
  class PendingApprovalsController < ApplicationController
    before_action :signed_in_reviewer
    before_action :set_project
    before_action :set_pending_approval
    before_action :require_hq_reviewer, only: [ :publish, :discard ]

    skip_after_action :verify_authorized

    def edit
      render inertia: "projects/reviews/edit", props: {
        project: @project.display_hash(user: true, reviews: true, admin: current_user.admin?, reviewer: current_user.reviewer?),
        review: @pending_approval.display_hash(admin: true)
      }
    end

    def update
      @pending_approval.update!(pending_approval_params)

      # Only HQ reviewers decide the golden ticket; a community reviewer editing
      # their own held approval cannot set it.
      @pending_approval.update!(grant_golden_ticket: golden_ticket_requested?) if current_user.hq_reviewer?

      flash[:notice] = "Edited review"

      redirect_back_or_to manage_project_path(@project)
    end

    # Authorize the held approval: transform it into a published Project::Review.
    def publish
      @pending_approval.authorize!(authorized_by: current_user)

      flash[:notice] = "Authorized review"

      redirect_back_or_to manage_project_path(@project)
    end

    # Discard the held approval without publishing anything.
    def discard
      @pending_approval.destroy!

      flash[:notice] = "Discarded pending approval"

      redirect_back_or_to manage_project_path(@project)
    end

    private

    def pending_approval_params
      params.require(:review).permit(:content, :admin_content).merge(
        approved_seconds: (params[:approved_hours].to_f * 3600).to_i
      )
    end

    def golden_ticket_requested?
      ActiveModel::Type::Boolean.new.cast(params[:high_quality])
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    def set_pending_approval
      @pending_approval = @project.pending_approvals.find(params[:id])
    end

    def require_hq_reviewer
      raise Pundit::NotAuthorizedError unless current_user.hq_reviewer?
    end
  end
end
