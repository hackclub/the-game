class OrdersController < ApplicationController
  before_action :signed_in_admin
  before_action :get_order, only: [:show]
  skip_after_action :verify_authorized
 
  def show
    render inertia: "orders/show", props: {
      orders: @order,
      order_user: @order.user,
      item: @order.item
    }
  end


  private

  def get_order
    @order = Item::Purchase.find(params[:id])
  end

  def authorize_order_access
    unless current_user&.role == "admin" || current_user == @order.user
      redirect_to root_path, alert: "Not authorized"
    end
  end
end