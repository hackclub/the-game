module OneTimeJobs
  # Restores purchases that were incorrectly soft-deleted by the
  # AddAmountPaidToItemPurchase migration (commit 34ead10), which called
  # purchase.delete on every record rather than only previously-deleted ones.
  #
  # Run from the Rails console:
  #   OneTimeJobs::RestorePurchasesAfterMigrationJob.perform_now
  #
  # You can override the deletion window if needed:
  #   OneTimeJobs::RestorePurchasesAfterMigrationJob.perform_now(
  #     window_start: Time.zone.parse("2026-03-30 21:40:00 -0400"),
  #     window_end:   Time.zone.parse("2026-03-30 22:10:00 -0400")
  #   )
  class RestorePurchasesAfterMigrationJob < ApplicationJob
    queue_as :default

    # Commit was published at 6:26pm EDT; deployment takes some time, so the
    # migration ran sometime after that. 30-minute window with buffer on both ends.
    DELETION_WINDOW_START = Time.zone.parse("2026-03-30 18:20:00 -0400")
    DELETION_WINDOW_END   = Time.zone.parse("2026-03-30 18:56:00 -0400")

    def perform(window_start: DELETION_WINDOW_START, window_end: DELETION_WINDOW_END)
      log "Starting purchase restoration for deletions between #{window_start} and #{window_end}"

      improperly_deleted = Item::Purchase.only_deleted
                                         .where(deleted_at: window_start..window_end)
                                         .includes(:user, :item)

      log "Found #{improperly_deleted.count} improperly deleted purchase(s)"
      return log("Nothing to do.") if improperly_deleted.none?

      to_restore  = improperly_deleted.to_a
      to_destroy  = []

      improperly_deleted.group_by(&:user_id).each do |user_id, old_purchases|
        user = User.find(user_id)
        new_purchases = Item::Purchase.where(user: user)
                                      .where("created_at > ?", window_end)
                                      .includes(:item)

        next if new_purchases.none?

        log "\nUser #{user.username || user.email} has #{new_purchases.count} new purchase(s) placed after the migration:"

        # Track the running cost of new purchases we decide to keep, so that
        # subsequent decisions for the same user account for already-kept orders.
        kept_new_expenses = 0

        new_purchases.each do |np|
          log "  New order ##{np.id}: #{np.quantity}x #{np.item.name} (#{np.amount_paid} tickets)"

          duplicate = old_purchases.find { |op| op.item_id == np.item_id }

          if duplicate
            log "  -> Same item as deleted purchase ##{duplicate.id}. Removing new order, restoring original."
            to_destroy << np
          else
            # Balance the user would have once old purchases are restored,
            # minus any new orders we've already decided to keep.
            old_expenses        = old_purchases.sum(&:amount_paid)
            hypothetical_balance = user.balance - old_expenses - kept_new_expenses

            log "  -> Different item. Balance after restoring old orders: #{hypothetical_balance} tickets (currently #{user.balance})."

            if hypothetical_balance >= np.amount_paid
              log "  -> User can afford this. Keep new order ##{np.id}? [y/N]"
              answer = $stdin.gets.chomp.downcase
              if answer == "y"
                log "  -> Keeping new order ##{np.id}."
                kept_new_expenses += np.amount_paid
              else
                log "  -> Dropping new order ##{np.id}."
                to_destroy << np
              end
            else
              log "  -> User cannot afford this after restoration (needs #{np.amount_paid}, would have #{hypothetical_balance}). Dropping new order ##{np.id}."
              to_destroy << np
            end
          end
        end
      end

      log "\n--- Plan ---"
      log "Restore #{to_restore.count} old purchase(s):"
      to_restore.each { |p| log "  ##{p.id}  #{p.quantity}x #{p.item.name} — #{p.user.username || p.user.email}" }

      log "Soft-delete #{to_destroy.count} new purchase(s):"
      to_destroy.each { |p| log "  ##{p.id}  #{p.quantity}x #{p.item.name} — #{p.user.username || p.user.email}" }

      log "\nProceed? [y/N]"
      return log("Aborted.") unless $stdin.gets.chomp.downcase == "y"

      ActiveRecord::Base.transaction do
        to_destroy.each do |p|
          p.destroy
          log "Soft-deleted new purchase ##{p.id} (#{p.item.name})"
        end

        to_restore.each do |p|
          p.recover
          log "Restored purchase ##{p.id} (#{p.item.name} for #{p.user.username || p.user.email})"
        end
      end

      log "Done."
    end

    private

    def log(msg)
      puts msg
      Rails.logger.info("[RestorePurchasesAfterMigrationJob] #{msg}")
    end
  end
end
