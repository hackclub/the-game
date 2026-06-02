class Project
  class ReviewsController < ApplicationController
    before_action :signed_in_reviewer
    before_action :set_project
    before_action :set_review, only: [ :edit, :update, :destroy ]

    skip_after_action :verify_authorized

    def create
      review = @project.reviews.create!(review_params)

      if params[:high_quality].present? && review.approval?
        was_high_quality = @project.high_quality?
        @project.update!(high_quality: params[:high_quality])
        post_golden_ticket_announcement(@project) if !was_high_quality && @project.high_quality?
      end

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

    def post_golden_ticket_announcement(project)
      author_ping = project.user.slack_id.present? ? "<@#{project.user.slack_id}>" : project.user.username
      text = ":rac_woah: #{author_ping} got a golden ticket for their project *#{project.title}*!! check it out <#{project.demo_link}|here!>"
      channel = ENV.fetch("GOLDEN_TICKET_SLACK_CHANNEL", SlackChannels::THE_GAME)
      SlackApiService.post_message(channel: channel, text: text)
    end
  end
end
