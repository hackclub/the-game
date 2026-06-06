class AddReviewerAndFulfillerToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :is_reviewer, :boolean, default: false, null: false
    add_column :users, :is_fulfiller, :boolean, default: false, null: false

    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE users SET is_reviewer = true WHERE role = 'reviewer';
          UPDATE users SET is_fulfiller = true WHERE role = 'fulfiller';
          UPDATE users SET role = 'user' WHERE role IN ('reviewer', 'fulfiller');
        SQL
      end
    end
  end
end
