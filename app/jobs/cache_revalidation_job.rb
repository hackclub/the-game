class CacheRevalidationJob < ApplicationJob
  queue_as :low

  def perform(key, model, fetcher_method, max_ttl)
    fresh = model.public_send(fetcher_method)
    Rails.cache.write(
      key,
      { value: fresh, stored_at: Time.current },
      expires_in: max_ttl
    )
  end
end
