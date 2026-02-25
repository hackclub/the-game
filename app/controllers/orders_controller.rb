class OrdersController < ApplicationController
  before_action :signed_in_admin, only: [ :show, :destroy, :cancel, :fulfill ]
  before_action :get_order, only: [ :show, :destroy, :cancel, :fulfill ]
  skip_after_action :verify_authorized

  def index
    @orders = Item::Purchase.where(user_id: current_user.id).includes(:item)
    render inertia: "orders/index", props: {
      orders: @orders.map { |order| order.display_hash(item: true) }
    }
  end

  def show
    render inertia: "orders/show", props: {
      order: @order.display_hash,
      order_user: @order.user.display_hash(private: true),
      item: @order.item.display_hash
    }
  end

  def destroy
    @order.destroy!
    redirect_to admin_orders_path, notice: "Order Deleted"
  end

  def cancel
    @order.cancel!
    redirect_to admin_orders_path(@order), notice: "Order cancelled"
  end

  def fulfill
    @order.fulfill!
    redirect_to admin_orders_path, notice: "Order fulfilled"
  end

  private

  def get_order
    @order = Item::Purchase.find(params[:id])
  end
end
