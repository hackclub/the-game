class SettingsController < ApplicationController
  def index
    skip_authorization
    render inertia: "settings/index"
  end
end
