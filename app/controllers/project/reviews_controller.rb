class Project
  class ReviewsController < ApplicationController
    before_action :signed_in_reviewer
    before_action :set_project
    before_action :set_review, only: [ :edit, :update, :destroy, :publish, :discard ]
    before_action :require_hq_reviewer, only: [ :publish, :discard ]
    before_action :require_pending_hq_review, only: [ :publish, :discard ]

    skip_after_action :verify_authorized

    def create
      # A project with an approval awaiting HQ authorization is locked: it must be
      # authorized or discarded before any new review can be placed.
      if @project.pending_hq?
        flash[:alert] = "This project has an approval awaiting HQ authorization."
        return redirect_back_or_to manage_project_path(@project)
      end

      review = @project.reviews.new(review_params)
      review.author = current_user

      # HQ reviewers' approvals publish immediately; community reviewers' approvals
      # are held in pending_hq until an HQ reviewer authorizes them.
      if review.approval? && current_user.hq_reviewer?
        review.authorized_at = Time.current
        review.authorized_by = current_user
      end

      # Only HQ reviewers grant golden tickets. A community approval is a template
      # an HQ reviewer can edit (including the golden ticket) before authorizing, so
      # its golden ticket is never set here. The grant is applied on publish.
      review.grant_golden_ticket = review.approval? && current_user.hq_reviewer? && golden_ticket_requested?

      review.save!

      human_review_desc = case review.review_type
      when "comment"
        "Added comment on"
      when "approval"
        review.pending_hq? ? "Submitted approval for HQ review on" : "Approved"
      when "rejection"
        "Rejected"
      end

      flash[:notice] = "#{human_review_desc} \"#{@project.title}\"#{" for #{params[:approved_hours]} hours" if review.approval? && params[:approved_hours].present?}"

      redirect_back_or_to manage_project_path(@project)
    end

    def publish
      @review.authorize!(authorized_by: current_user)

      flash[:notice] = "Authorized review"

      redirect_back_or_to manage_project_path(@project)
    end

    def discard
      @review.destroy!

      flash[:notice] = "Discarded pending approval"

      redirect_back_or_to manage_project_path(@project)
    end

    def edit
      render inertia: "projects/reviews/edit", props: { project: @project.display_hash(user: true, reviews: true, admin: current_user.admin?, reviewer: current_user.reviewer?), review: @review.display_hash(admin: true) }
    end

    def update
      # Editing must not steal authorship from the original (community) reviewer —
      # leaderboard credit and the Airtable "reviewed by" stay with them, so author
      # is left untouched here. Only an HQ reviewer may change the golden ticket.
      @review.update!(review_params)

      if current_user.hq_reviewer?
        @review.update!(grant_golden_ticket: @review.approval? && golden_ticket_requested?)
        @review.apply_golden_ticket!
      end

      flash[:notice] = "Edited review"

      redirect_back_or_to manage_project_path(@project)
    end

    def destroy
      @review.destroy!

      flash[:notice] = "Deleted review"

      redirect_back_or_to manage_project_path(@project)
    end

    private

    def review_params
      p = params.require(:review).permit(:content, :review_type, :admin_content)

      p.merge(approved_seconds: p[:review_type] == "approval" ? params[:approved_hours] * 3600 : nil)
    end

    def golden_ticket_requested?
      ActiveModel::Type::Boolean.new.cast(params[:high_quality])
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    def set_review
      @review = Project::Review.find(params[:id])
    end

    def require_hq_reviewer
      raise Pundit::NotAuthorizedError unless current_user.hq_reviewer?
    end

    # publish/discard only apply to an approval still awaiting HQ authorization;
    # anything else (a published approval, rejection, or comment) goes through the
    # normal edit/undo flow.
    def require_pending_hq_review
      unless @review.pending_hq?
        flash[:alert] = "This review is not awaiting HQ authorization."
        redirect_back_or_to manage_project_path(@project)
      end
    end
  end
end
