class Statistic < AirpplicationRecord
  self.table_name = "Statistics"

  field :date

  field :approved_hours
  field :project_count

  field :user_count
  field :user_account_count
  field :user_hackatime_count
  field :user_project_created_count
  field :user_project_shipped_count

  def self.generate_statistic_data
    approved_hours = Project.all.reduce(0) { |acc, project| acc + (project.approved_seconds || 0) } / 3600.0
    project_count = Project.count

    user_count = User.count
    user_onboarding_count = User.where(onboarding_completed: true).count
    user_account_count = User.where.not(account_id: nil).count
    user_hackatime_count = User.where.not(hackatime_id: nil).count
    user_idv_verified_count = User.where(verification_status: User::VERIFIED_VERIFICATION_STATUSES).count
    user_project_created_count = User.joins(:projects).distinct.count
    user_project_submitted_count = User.joins(:projects).where(projects: { aasm_state: %w[submitted approved] }).distinct.count
    user_project_shipped_count = User.joins(:projects).where(projects: { aasm_state: :approved }).distinct.count

    {
      date: DateTime.now.to_s,
      approved_hours:,
      project_count:,
      user_count:,
      user_onboarding_count:,
      user_account_count:,
      user_hackatime_count:,
      user_idv_verified_count:,
      user_project_created_count:,
      user_project_submitted_count:,
      user_project_shipped_count:
    }
  end
end
