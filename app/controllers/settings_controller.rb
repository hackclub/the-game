class SettingsController < ApplicationController
  def index
    @user = current_user
    render inertia: "settings/index", props: { user: @user }
  end

  def update
  end
end
