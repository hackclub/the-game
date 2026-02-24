class OrdersController < ApplicationController
  before_action :signed_in_admin
  skip_after_action :verify_authorized
 
  def show
  orders = @order.all
  Rails.logger.warn(orders)
  render inertia: "orders/show", props: { orders: orders}
  end


  private
  def get_order
    @order = Item::Purchase.find(params[:id])
  end
end
