class GenerateStatisticsJob < ApplicationJob
  queue_as :default

  def perform
    approved_hours = Project.all.reduce(0) { |acc, project| acc + (project.approved_seconds || 0) } / 3600.0
    project_count = Project.count

    user_count = User.count
    user_account_count = User.where.not(account_id: nil).count
    user_hackatime_count = User.where.not(hackatime_id: nil).count
    user_project_created_count = User.joins(:projects).distinct.count
    user_project_shipped_count = User.joins(:projects).where.not(projects: { aasm_state: :pending }).distinct.count

    Statistic.create({
      date: DateTime.now.to_s,
      approved_hours:,
      project_count:,
      user_count:,
      user_account_count:,
      user_hackatime_count:,
      user_project_created_count:,
      user_project_shipped_count:
    })
  end
end
