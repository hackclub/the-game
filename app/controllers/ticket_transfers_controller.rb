class TicketTransfersController < ApplicationController
  include ActionView::Helpers::TextHelper

  skip_after_action :verify_authorized
  before_action :signed_in_admin, only: :destroy

  def create
    to_user = User.find_by(slack_id: params[:slack_id])
    TicketTransfer.create!(transfer_params.merge(from_user_id: params[:user_id], to_user:))

    flash[:notice] = "Transferred #{pluralize(transfer_params[:amount], "ticket")} to #{to_user.username}"

    redirect_back_or_to user_path(params[:user_id])
  end

  def destroy
    transfer = TicketTransfer.find(params[:id])
    transfer.destroy!

    flash[:notice] = "Removed ticket transfer for #{pluralize(transfer.amount, "ticket")}"

    redirect_back_or_to user_path(params[:user_id])
  end

  private

  def transfer_params
    params.require(:ticket_transfer).permit(:amount)
  end
end
