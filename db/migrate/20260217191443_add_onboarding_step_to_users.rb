class AddOnboardingStepToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :onboarding_step, :string, default: "link_hackatime"

    reversible do |dir|
      dir.up do
        execute <<-SQL.squish
          UPDATE users SET onboarding_step = NULL
          WHERE hackatime_id IS NOT NULL
          AND id IN (SELECT DISTINCT user_id FROM projects)
        SQL
        execute <<-SQL.squish
          UPDATE users SET onboarding_step = 'go_to_projects'
          WHERE hackatime_id IS NOT NULL
          AND onboarding_step = 'link_hackatime'
        SQL
      end
    end
  end
end
