# Tracks the state of the (single, shared) unshipped-Hackatime CSV export as it
# runs in the background, backed by Rails.cache so the Sidekiq worker and the
# web process can see the same progress. Only the latest export is kept.
#
# The generated CSV itself is stored as an ActiveStorage blob; we keep only its
# signed id here and stream it back on download.
class UnshippedHackatimeExport
  CACHE_KEY = "unshipped_hackatime_export".freeze
  TTL = 1.day

  STATUSES = %w[idle pending running completed failed].freeze

  class << self
    def state
      Rails.cache.read(CACHE_KEY) || { status: "idle" }
    end

    def running?
      %w[pending running].include?(state[:status])
    end

    # Enqueues an export unless one is already in flight. Returns the current
    # state either way.
    def enqueue!(requested_by: nil)
      return state if running?

      # Drop the previous run's file so regenerating doesn't orphan blobs.
      blob&.purge_later

      write(
        status: "pending",
        requested_by: requested_by,
        total: nil,
        processed: 0,
        rows_count: nil,
        error: nil,
        blob_signed_id: nil,
        started_at: nil,
        finished_at: nil
      )
      UnshippedHackatimeExportJob.perform_later
      state
    end

    # Merges the given attributes into the stored state.
    def write(attrs)
      Rails.cache.write(CACHE_KEY, state.merge(attrs), expires_in: TTL)
    end

    # The completed export's stored CSV, or nil if there isn't one.
    def blob
      signed_id = state[:blob_signed_id]
      signed_id && ActiveStorage::Blob.find_signed(signed_id)
    end

    # State shaped for the frontend — never exposes the blob id, just whether a
    # downloadable file exists.
    def public_state
      s = state
      {
        status: s[:status],
        total: s[:total],
        processed: s[:processed] || 0,
        rows_count: s[:rows_count],
        error: s[:error],
        has_file: s[:blob_signed_id].present?,
        requested_by: s[:requested_by],
        started_at: s[:started_at],
        finished_at: s[:finished_at]
      }
    end
  end
end
