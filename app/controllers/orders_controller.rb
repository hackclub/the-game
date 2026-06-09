class OrdersController < ApplicationController
  before_action :signed_in_fulfiller, except: :index
  before_action :get_order, only: [ :show, :destroy, :hold, :fulfill, :update ]
  skip_after_action :verify_authorized

  def index
    @orders = Item::Purchase.where(user_id: current_user.id).includes(:item)
    render inertia: "orders/index", props: {
      orders: @orders.map { |order| order.display_hash(item: true) }
    }
  end

  def show
    render inertia: "orders/show", props: {
      order: @order.display_hash(admin: current_user.admin?),
      order_user: @order.user.display_hash(private: true),
      item: @order.item.display_hash
    }
  end

  def destroy
    @order.destroy!
    redirect_to order_path(@order), notice: "Order Deleted"
  end

  def hold
    @order.hold!
    redirect_to admin_orders_path(@order), notice: "Order placed on hold"
  end

  def fulfill
    @order.fulfill!
    @order.notify_fulfillment!
    redirect_to admin_orders_path, notice: "Order fulfilled"
  end

  def update
    @order.update!(order_params)
    redirect_to order_path(@order), notice: "Order updated"
  end

  private

  def get_order
    @order = Item::Purchase.with_deleted.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:admin_note, :user_note)
  end
end
