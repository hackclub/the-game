class OnboardingController < ApplicationController
  skip_after_action :verify_authorized

  def complete
    current_user.update!(onboarding_completed: true)
    redirect_back_or_to home_path
  end
end
