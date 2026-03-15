class ReferralRolloutJob < ApplicationJob
  queue_as :default

  def perform
    program = ReferralProgram.instance
    return unless program.rollout_status == "running"
    return if program.rollout_count >= program.max_referrers

    batch_size = [ program.rollout_batch_size, program.max_referrers - program.rollout_count ].min

    eligible_users = User.where(referral_eligible: false, is_banned: false)
                         .where.not(slack_id: nil)
                         .left_joins(:projects)
                         .joins("INNER JOIN project_reviews ON project_reviews.project_id = projects.id AND project_reviews.review_type = 'approval'")
                         .group("users.id")
                         .order(Arel.sql("COALESCE(SUM(project_reviews.approved_seconds), 0) DESC"))
                         .limit(batch_size)

    count = 0
    eligible_users.each do |user|
      user.update!(referral_eligible: true)
      ReferralSlackNotifyJob.perform_later(user.id)
      count += 1
    end

    program.update!(
      rollout_count: program.rollout_count + count,
      last_rollout_at: Time.current
    )

    if program.rollout_count >= program.max_referrers
      program.update!(rollout_status: "completed")
    else
      ReferralRolloutJob.set(wait: program.rollout_interval_hours.hours).perform_later
    end
  end
end
