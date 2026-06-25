class AddGoldenTicketToProjectReviews < ActiveRecord::Migration[8.1]
  def change
    # Whether authorizing this approval should grant the project a golden ticket.
    # Held community approvals only record the intent; the golden ticket is applied
    # when an HQ reviewer authorizes the approval (or immediately for HQ approvals).
    add_column :project_reviews, :grant_golden_ticket, :boolean, default: false, null: false
  end
end
