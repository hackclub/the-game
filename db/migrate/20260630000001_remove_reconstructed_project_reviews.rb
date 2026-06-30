class RemoveReconstructedProjectReviews < ActiveRecord::Migration[8.0]
  # A backfill briefly persisted approval/rejection reviews reconstructed from the
  # aasm_state history for submissions whose original review had been deleted. A
  # deleted review is not a real verdict and must not live in the ledger, so these
  # synthetic rows are removed. They're identifiable by their justification note and
  # the absence of any reviewer-facing message (content). Hard-deleted via raw SQL so
  # they don't linger as acts_as_paranoid soft-deletes.
  NOTE = "Reconstructed from project history — the original review record is unavailable."

  def up
    execute(<<~SQL.squish)
      DELETE FROM project_reviews
      WHERE admin_content = #{quote(NOTE)}
        AND (content IS NULL OR content = '')
    SQL
  end

  def down
    raise ActiveRecord::IrreversibleMigration,
      "Reconstructed reviews were erroneous and cannot be recreated."
  end
end
