class OnboardingController < ApplicationController
  skip_after_action :verify_authorized

  def complete
    current_user.update!(onboarding_completed: true)

    track_event("onboarding_completed", {
      hackatime_linked: current_user.hackatime_id.present?,
      project_count: current_user.projects.count
    })

    redirect_back_or_to home_path
  end
end
