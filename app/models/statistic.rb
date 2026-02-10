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
end
