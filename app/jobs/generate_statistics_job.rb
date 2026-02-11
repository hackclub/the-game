class GenerateStatisticsJob < ApplicationJob
  queue_as :default

  def perform
    data = Statistic.generate_statistic_data
    Statistic.create(data)
  end
end
