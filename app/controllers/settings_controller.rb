class SettingsController < ApplicationController
  def index
    render inertia: "settings/index", props: {
      email: current_user.email,
      hca_linked: current_user.account_access_token.present?,
      hackatime_linked: current_user.hackatime_id.present?,
      admin: current_user.admin?
    }
  end

  def update
  end
end
