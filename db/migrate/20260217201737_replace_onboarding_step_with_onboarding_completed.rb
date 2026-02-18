class ReplaceOnboardingStepWithOnboardingCompleted < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :onboarding_completed, :boolean, default: false, null: false

    reversible do |dir|
      dir.up do
        execute <<-SQL.squish
          UPDATE users SET onboarding_completed = TRUE
          WHERE onboarding_step IS NULL
        SQL
      end
    end

    remove_column :users, :onboarding_step, :string, default: "link_hackatime"
  end
end
