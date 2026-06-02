class TicketAdjustmentsController < ApplicationController
  include ActionView::Helpers::TextHelper

  skip_after_action :verify_authorized
  before_action :signed_in_admin

  def create
    TicketAdjustment.create!(adjustment_params.merge(user_id: params[:user_id].to_i))

    flash[:notice] = "#{adjustment_params[:amount].positive? ? "Added" : "Removed"} #{pluralize(adjustment_params[:amount].abs, "ticket")}"

    redirect_back_or_to admin_user_path(params[:user_id])
  end

  def destroy
    adjustment = TicketAdjustment.find(params[:id])
    adjustment.destroy!

    flash[:notice] = "Removed ticket adjustment for #{pluralize(adjustment.amount, "ticket")}"

    redirect_back_or_to admin_user_path(adjustment.user)
  end

  private

  def adjustment_params
    params.require(:ticket_adjustment).permit(:amount, :reason)
  end
end
