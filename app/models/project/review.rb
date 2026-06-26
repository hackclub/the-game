# == Schema Information
#
# Table name: project_reviews
#
#  id                  :bigint           not null, primary key
#  admin_content       :text
#  approved_seconds    :integer
#  content             :text
#  deleted_at          :datetime
#  grant_golden_ticket :boolean          default(FALSE), not null
#  review_type         :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  author_id           :bigint           not null
#  authorized_by_id    :bigint
#  project_id          :bigint           not null
#
# Indexes
#
#  index_project_reviews_on_author_id         (author_id)
#  index_project_reviews_on_authorized_by_id  (authorized_by_id)
#  index_project_reviews_on_project_id        (project_id)
#
class Project
  class Review < ApplicationRecord
    include ActionView::Helpers::DateHelper

    acts_as_paranoid

    belongs_to :author, class_name: "User"
    belongs_to :project
    belongs_to :authorized_by, class_name: "User", optional: true

    has_one :notification, required: false, as: :notifiable

    enum :review_type, { comment: "comment", rejection: "rejection", approval: "approval" }

    scope :not_admin_only, -> { where.not(content: nil).where.not(content: "") }

    validate :non_comments_have_justification
    validate :only_approvals_have_seconds
    validate :project_is_under_review, on: :create
    validate :no_pending_approval, on: :create

    after_create_commit do
      case review_type
      when "rejection"
        project.mark_rejected! unless project.rejected?
        create_notification if content.present?
      when "approval"
        publish_approval!
      else # comment
        create_notification if content.present?
      end
    end

    # undo
    after_destroy_commit do
      next if comment?

      project_version = project.versions.where_object_changes_to(aasm_state: project.aasm_state).last
      project_version.reify.save!
      project.versions.last.delete

      create_destroy_notification

      ysws_record&.destroy
    end

    # Applies the golden ticket for this approval: marks the project high quality
    # and announces it. Only takes effect for an approval flagged to grant one, and
    # is a no-op once the project is already high quality, so it is safe to call
    # from every publish/edit path.
    def apply_golden_ticket!
      return unless approval? && grant_golden_ticket?
      return if project.high_quality?

      project.update!(high_quality: true)
      announce_golden_ticket!
    end

    def display_hash(author: false, admin: false)
      hash = self.as_json.slice("id", "content", "review_type", "author_id", "created_at", "project_id", "approved_seconds")

      if author
        hash["author"] = self.author.display_hash
      end

      if admin
        hash["admin_content"] = self.admin_content
        hash["grant_golden_ticket"] = grant_golden_ticket
      end

      hash
    end

    def ysws_record
      Project::Ysws.find_by(review_id: id)
    end

    def approved_words
      approved_seconds.present? ? distance_of_time_in_words(approved_seconds) : nil
    end

    private

    # Performs the user-visible effects of an approval: project state, author
    # notification, Airtable sync, and golden ticket. A Project::Review only ever
    # exists once it is authorized (held community approvals live in
    # Project::PendingApproval), so this always runs for a published approval.
    def publish_approval!
      project.mark_approved! unless project.approved?
      create_notification if content.present?
      create_ysws_record
      apply_golden_ticket!
    end

    def announce_golden_ticket!
      author_ping = project.user.slack_id.present? ? "<@#{project.user.slack_id}>" : project.user.username
      text = ":rac_woah: #{author_ping} got a golden ticket for their project *#{project.title}*!! check it out <#{project.demo_link}|here!>"
      channel = ENV.fetch("GOLDEN_TICKET_SLACK_CHANNEL", SlackChannels::THE_GAME)
      SlackApiService.post_message(channel: channel, text: text)
    end

    def non_comments_have_justification
      if (!content.present? || !admin_content.present?) && !comment?
        errors.add(:base, "Approvals and rejections must have user comments and justification")
      end
    end

    def only_approvals_have_seconds
      if approval? && approved_seconds.nil?
        errors.add(:base, "Approvals must include approved_seconds")
      end

      if !approval? && approved_seconds.present?
        errors.add(:base, "Only approvals can include approved_seconds")
      end
    end

    def project_is_under_review
      if !comment? && !project.submitted?
        errors.add(:base, "Project must be under review to approve or reject")
      end
    end

    # A project with a community approval awaiting HQ authorization is locked: an
    # HQ reviewer must authorize or discard the held approval before any new verdict
    # can be placed. Comments are always allowed. (Project::PendingApproval#authorize!
    # removes the placeholder before creating the published review, so this guard
    # does not block the very approval being authorized.)
    def no_pending_approval
      return if comment?

      if project.pending_approvals.exists?
        errors.add(:base, "Project already has an approval awaiting HQ authorization")
      end
    end

    def create_notification
      base_message = case review_type
      when "comment"
                  "A comment has been added to your project \"#{project.title}\"."
      when "rejection"
                  "Your project \"#{project.title}\" has been rejected."
      when "approval"
                  "Your project \"#{project.title}\" has been approved for #{approved_words}!"
      end

      message = "#{base_message}#{"\n>#{content}" if content.present?}"

      Notification.create!(user: project.user, notifiable: self, message:, link: Rails.application.routes.url_helpers.project_url(project))
    end

    def create_destroy_notification
      message = case review_type
      when "comment"
                  return
      when "rejection"
                  "The rejection for your project \"#{project.title}\" has been removed."
      when "approval"
                  "The approval for your project \"#{project.title}\" has been removed."
      end

      Notification.create!(user: project.user, notifiable: self, message:, link: Rails.application.routes.url_helpers.project_url(project))
    end

    def create_ysws_record
      return if ENV["DRY_RUN"].present?

      project.reload
      tracked_time = format_duration(project.approved_seconds)
      adjusted_time = format_duration(approved_seconds)
      hackatime_names = project.hackatime_projects.pluck(:name).join(", ")
      submitted_date = project.submitted_at.strftime("%Y-%m-%d")

      prior_approval = project.reviews.approval.where.not(id: id).order(:created_at).last
      is_reship = prior_approval.present?

      time_summary = if tracked_time == adjusted_time
        "This user tracked #{tracked_time} on Hackatime and was approved for the full time tracked."
      else
        "This user tracked #{tracked_time} on Hackatime. This was adjusted to #{adjusted_time} after review."
      end

      if is_reship
        last_ship_date = prior_approval.created_at.strftime("%Y-%m-%d")
        submission_line = "Project was reshipped by @/#{project.user.username} on #{submitted_date}. Previously shipped on #{last_ship_date}"
        time_range = "time from #{last_ship_date} to #{submitted_date}"
        lapse_start = prior_approval.created_at
      else
        submission_line = "Project was submitted by @/#{project.user.username} on #{submitted_date}"
        time_range = "time from 2025-12-22 to #{submitted_date}"
        lapse_start = Time.parse("2025-12-22T00:00:00Z")
      end

      lapse_timelapses = fetch_lapse_timelapses(lapse_start, project.submitted_at)

      lapse_section = if lapse_timelapses.any?
        lines = lapse_timelapses.map do |t|
          date = Time.at(t["createdAt"] / 1000.0).utc
          date_str = "#{date.strftime("%B")} #{date.day.ordinalize}, #{date.year}"
          duration_str = format_timelapse_duration(t["duration"])
          "- https://lapse.hackclub.com/timelapse/#{t["id"]} (#{duration_str} created on #{date_str})"
        end
        "\n\nThis project has #{lapse_timelapses.length} timelapse#{"s" if lapse_timelapses.length != 1} tracked with Lapse:\n#{lines.join("\n")}"
      else
        ""
      end

      review_reason = <<~TEXT.strip
        #{time_summary}

        #{admin_content}

        #{submission_line}

        The Hackatime projects submitted were: #{hackatime_names} and included #{time_range}

        Project was reviewed by @/#{author.username} on #{created_at.strftime("%Y-%m-%d")}.
      TEXT

      review_reason += lapse_section

      ysws_project = Project::Ysws.create(
        project_id: project.id,
        review_id: id,
        first_name: project.user.first_name,
        last_name: project.user.last_name,
        email: project.user.email,
        github_username: project.github_username,
        address_line1: project.user.address_street,
        address_city: project.user.address_locality,
        address_state: project.user.address_region,
        address_country: project.user.address_country,
        address_postal: project.user.address_postal,
        birthday: project.user.birthday,
        name: project.title,
        description: project.desc,
        hours: approved_seconds / 3600.0,
        review_reason:,
        code_url: project.repo_link,
        playable_url: project.demo_link
      )

      ysws_project.attach_screenshot(project.screenshot)
    end

    def format_duration(seconds)
      hours = seconds / 3600
      minutes = (seconds % 3600) / 60
      "#{hours}h #{minutes}min"
    end

    def format_timelapse_duration(seconds)
      total_minutes = (seconds / 60).round
      hours = total_minutes / 60
      minutes = total_minutes % 60
      "#{hours}h #{minutes}m"
    end

    def fetch_lapse_timelapses(start_time, end_time)
      hackatime_user_id = project.user.hackatime_id
      return [] unless hackatime_user_id.present?

      start_ms = start_time.to_i * 1000
      end_ms = end_time.to_i * 1000

      client = Faraday.new(url: "https://api.lapse.hackclub.com/api/hackatime") do |conn|
        conn.response :json, content_type: /\bjson$/
      end

      timelapses = []

      project.hackatime_projects.each do |hp|
        begin
          response = client.get("timelapsesForProject") do |req|
            req.params = { hackatimeUserId: hackatime_user_id, projectKey: hp.name }
          end

          next unless response.success?

          body = response.body
          next unless body["ok"] && body.dig("data", "timelapses")

          body["data"]["timelapses"].each do |t|
            ms = t["createdAt"]
            timelapses << t if ms >= start_ms && ms <= end_ms
          end
        rescue
          next
        end
      end

      timelapses
    rescue
      []
    end
  end
end
