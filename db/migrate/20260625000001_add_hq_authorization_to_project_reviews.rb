class AddHqAuthorizationToProjectReviews < ActiveRecord::Migration[8.1]
  def change
    # Records which HQ reviewer released (authorized) a community approval for
    # publishing. Null for HQ reviewers' own approvals and for approvals that
    # predate HQ review. Held community approvals live in project_pending_approvals
    # until published, so a Project::Review is always an authorized verdict.
    add_column :project_reviews, :authorized_by_id, :bigint
    add_index :project_reviews, :authorized_by_id
  end
end
