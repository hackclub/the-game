class Project
  class ReviewsController < ApplicationController
    before_action :signed_in_reviewer
    before_action :set_project
    before_action :set_review, only: [ :edit, :update, :destroy ]

    skip_after_action :verify_authorized

    def create
      # A project with an approval awaiting HQ authorization is locked: it must be
      # authorized or discarded before any new review can be placed.
      if @project.pending_hq?
        flash[:alert] = "This project has an approval awaiting HQ authorization."
        return redirect_back_or_to manage_project_path(@project)
      end

      # A community reviewer's approval is held for HQ authorization: it is recorded
      # as a Project::PendingApproval and grants nothing until an HQ reviewer
      # authorizes it. HQ reviewers' approvals (and all rejections/comments) become
      # a real Project::Review immediately.
      if params.dig(:review, :review_type) == "approval" && !current_user.hq_reviewer?
        @project.pending_approvals.create!(
          author: current_user,
          content: params.dig(:review, :content),
          admin_content: params.dig(:review, :admin_content),
          approved_seconds: (params[:approved_hours].to_f * 3600).to_i
        )

        flash[:notice] = "Submitted approval for HQ review on \"#{@project.title}\"#{" for #{params[:approved_hours]} hours" if params[:approved_hours].present?}"
        return redirect_back_or_to manage_project_path(@project)
      end

      review = @project.reviews.new(review_params)
      review.author = current_user

      # Only HQ reviewers grant golden tickets, and an HQ approval publishes (and so
      # grants it) immediately.
      if review.approval? && current_user.hq_reviewer?
        review.authorized_by = current_user
        review.grant_golden_ticket = golden_ticket_requested?
      end

      review.save!

      human_review_desc = case review.review_type
      when "comment"
        "Added comment on"
      when "approval"
        "Approved"
      when "rejection"
        "Rejected"
      end

      flash[:notice] = "#{human_review_desc} \"#{@project.title}\"#{" for #{params[:approved_hours]} hours" if review.approval? && params[:approved_hours].present?}"

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
  end
end
