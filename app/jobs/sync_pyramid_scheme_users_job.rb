class SyncPyramidSchemeUsersJob < ApplicationJob
  queue_as :default

  def perform
    User.all.each(&:sync_pyramid_record)
  end
end
