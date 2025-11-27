class StaticPagesController < ApplicationController
  allow_unauthenticated_access only: %i[index]

  def index
    if user_logged_in?
      redirect_to home_path
      return
    end

    render inertia: {}
  end

  def home
    unless user_logged_in?
      redirect_to root_path
      return
    end

    render inertia: { account_linked: current_user.account_id.present?, hackatime_linked: current_user.hackatime_id.present? }
  end
end
