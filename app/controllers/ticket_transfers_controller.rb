class TicketTransfersController < ApplicationController
  include ActionView::Helpers::TextHelper

  skip_after_action :verify_authorized
  before_action :signed_in_admin, except: :create
  before_action :set_transfer, only: [ :show, :destroy, :approve, :reject ]

  def create
    to_user = User.find_by(slack_id: params[:slack_id])
    TicketTransfer.create!(transfer_params.merge(from_user_id: current_user.id, to_user:))

    flash[:notice] = "Requested to transfer #{pluralize(transfer_params[:amount], "ticket")} to #{to_user.username}"

    redirect_back_or_to admin_user_path(params[:user_id])
  end

  def destroy
    @transfer.destroy!

    flash[:notice] = "Removed ticket transfer for #{pluralize(@transfer.amount, "ticket")}"

    redirect_to admin_ticket_transfers_path
  end

  def show
    render inertia: "ticket_transfers/show", props: {
      transfer: @transfer.display_hash(private: true),
      from_user: @transfer.from_user.display_hash(private: true),
      to_user: @transfer.to_user.display_hash(private: true)
    }
  end

  def approve
    @transfer.mark_approved!

    flash[:notice] = "Approved ticket transfer!"

    redirect_to admin_ticket_transfers_path
  end

  def reject
    @transfer.mark_rejected!

    flash[:notice] = "Rejected ticket transfer"

    redirect_to admin_ticket_transfers_path
  end

  private

  def set_transfer
    @transfer = TicketTransfer.find(params[:id])
  end

  def transfer_params
    params.require(:ticket_transfer).permit(:amount, :reason)
  end
end
