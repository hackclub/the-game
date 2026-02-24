class OrdersController < ApplicationController
  before_action :signed_in_admin
  before_action :get_order, only: [:show, :destroy, :cancel, :fulfill]
  skip_after_action :verify_authorized
 
  def show
    render inertia: "orders/show", props: {
      orders: @order,
      order_user: @order.user.display_hash(private: true),
      item: @order.item.display_hash
    }
  end

  def cancel
    @order.cancel!
    redirect_to order_path(@order), notice: "Order cancelled"
  end

  def fulfill
    @order.fulfill!
    redirect_to order_path(@order), notice: "Order fulfilled"
  end

  def destroy
    @order.destroy!
    redirect_to admin_orders_path, notice: "Order deleted"
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