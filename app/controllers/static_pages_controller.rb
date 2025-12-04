class StaticPagesController < ApplicationController
  allow_unauthenticated_access only: %i[rsvp create_rsvp]

  def home
    unless user_logged_in?
      redirect_to root_path
      return
    end

    render inertia: { account_linked: current_user.account_id.present?, hackatime_linked: current_user.hackatime_id.present? }
  end

  def rsvp
    if user_logged_in?
      redirect_to home_path
      return
    end

    render inertia: {}
  end

  def create_rsvp
    email = params[:email]
    
    # TODO: Add backend logic to handle RSVP submission
    # For now, just redirect back with a success message
    
    redirect_to root_path, notice: "RSVP received! We'll be in touch soon."
  end
end
