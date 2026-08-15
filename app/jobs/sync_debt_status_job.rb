class SyncDebtStatusJob < ApplicationJob
  queue_as :default

  def perform
    balances = User.batch_balances(User.pluck(:id))

    now_in_debt = balances.select { |_, balance| balance.negative? }.keys
    now_clear = balances.select { |_, balance| balance >= 0 }.keys

    User.where(id: now_in_debt, is_debt: false).update_all(is_debt: true)
    User.where(id: now_clear, is_debt: true).update_all(is_debt: false)
  end
end
