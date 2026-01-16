class AddAasmStateToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :aasm_state, :string
    add_column :projects, :approved_at, :datetime
    add_column :projects, :rejected_at, :datetime

    remove_column :projects, :review_status, :integer
    remove_column :projects, :approved, :integer
    remove_column :projects, :shipped, :boolean
  end
end
