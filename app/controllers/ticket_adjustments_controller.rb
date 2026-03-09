class TicketAdjustmentsController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_admin

  def create
    TicketAdjustment.create!(adjustment_params.merge(user_id: params[:user_id].to_i))

    redirect_back_or_to user_path(params[:user_id])
  end

  def destroy
    adjustment = TicketAdjustment.find(params[:id])
    adjustment.destroy!

    redirect_back_or_to user_path(adjustment.user)
  end

  private

  def adjustment_params
    params.require(:ticket_adjustment).permit(:amount, :reason)
  end
end
