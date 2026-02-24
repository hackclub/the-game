class OrdersController < ApplicationController
  before_action :signed_in_admin
  before_action :get_order, only: [:show]
  skip_after_action :verify_authorized
 
  def show
  render inertia: "orders/show", props: { orders: @order }
  end


  private
  def get_order
    @order = Item::Purchase.find(params[:id])
  end
end
