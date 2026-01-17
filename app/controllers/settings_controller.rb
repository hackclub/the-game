class SettingsController < ApplicationController
  def index
    render inertia: "settings/index"
  end

  def update
  end
end
