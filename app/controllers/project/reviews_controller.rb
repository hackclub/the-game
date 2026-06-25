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

      # HQ reviewers' approvals publish immediately; community reviewers' approvals
      # are held in pending_hq until an HQ reviewer authorizes them.
      if review.approval? && current_user.hq_reviewer?
        review.authorized_at = Time.current
        review.authorized_by = current_user
      end

      review.save!

      if params[:high_quality].present? && review.approval?
        was_high_quality = @project.high_quality?
        @project.update!(high_quality: params[:high_quality])
        post_golden_ticket_announcement(@project) if !was_high_quality && @project.high_quality?
      end

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
      @review.update!(review_params)

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

      p.merge(author: current_user, approved_seconds: p[:review_type] == "approval" ? params[:approved_hours] * 3600 : nil)
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

    def post_golden_ticket_announcement(project)
      author_ping = project.user.slack_id.present? ? "<@#{project.user.slack_id}>" : project.user.username
      text = ":rac_woah: #{author_ping} got a golden ticket for their project *#{project.title}*!! check it out <#{project.demo_link}|here!>"
      channel = ENV.fetch("GOLDEN_TICKET_SLACK_CHANNEL", SlackChannels::THE_GAME)
      SlackApiService.post_message(channel: channel, text: text)
    end
  end
end
