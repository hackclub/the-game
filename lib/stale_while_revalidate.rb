module StaleWhileRevalidate
  # stale_after: serve cached value but trigger background refresh
  # max_ttl:     stop serving stale entirely; fetch synchronously
  def self.fetch(key, stale_after:, max_ttl:, revalidator:, &block)
    entry = Rails.cache.fetch(key, expires_in: max_ttl) do
      wrap(block.call)
    end

    age = Time.current - entry[:stored_at]

    if age > stale_after
      if age > max_ttl
        fresh = block.call
        Rails.cache.write(key, wrap(fresh), expires_in: max_ttl)
        return fresh
      else
        revalidator.call
      end
    end

    entry[:value]
  end

  def self.wrap(value)
    { value: value, stored_at: Time.current }
  end
end
