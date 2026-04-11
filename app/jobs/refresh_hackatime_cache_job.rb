class RefreshHackatimeCacheJob < ApplicationJob
  queue_as :low

  def perform
    # Manually trigger the SWR cache revalidation
    User.joins(:hackatime_projects).distinct.find_each(&:cached_hackatime_projects)
  end
end
