class CreateProjectPendingApprovals < ActiveRecord::Migration[8.1]
  def change
    # A community reviewer's approval that is held until an HQ reviewer authorizes
    # it. It is deliberately NOT a Project::Review: while held it must grant nothing
    # (no tickets, no approved time, no Airtable record, not in any review query).
    # On authorization it is transformed into a real, published Project::Review.
    create_table :project_pending_approvals do |t|
      t.bigint :project_id, null: false
      t.bigint :author_id, null: false
      t.text :content
      t.text :admin_content
      t.integer :approved_seconds
      t.boolean :grant_golden_ticket, default: false, null: false

      t.timestamps
    end

    add_index :project_pending_approvals, :project_id
    add_index :project_pending_approvals, :author_id
  end
end
