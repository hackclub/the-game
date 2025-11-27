class LandingController < ApplicationController
  allow_unauthenticated_access only: %i[index authed]

  def index
    if user_logged_in?
      redirect_to home_path
      return
    end

    render inertia: {}
  end

  def authed
    redirect_to root_path and return unless user_logged_in?

    render "landing/index", layout: false
  end

  def utm_source
    redirect_to root_path
  end
end
