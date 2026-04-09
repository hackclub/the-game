module SwrCacheable
  extend ActiveSupport::Concern

  included do
    def swr_cache(key, stale_after: 1.minute, max_ttl: 10.minutes, fetcher: nil, &block)
      StaleWhileRevalidate.fetch(
        key,
        stale_after: stale_after,
        max_ttl: max_ttl,
        revalidator: -> { CacheRevalidationJob.perform_later(key, self, fetcher.to_s, max_ttl) },
        &block
      )
    end
  end
end
