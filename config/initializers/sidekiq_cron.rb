unless Rails.env.development?
  Sidekiq::Cron.configure do |config|
    config.cron_poll_interval = 30
  end
end
