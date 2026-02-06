class ItemsController < ApplicationController
  before_action :set_item, only: [ :buy ]
  skip_after_action :verify_authorized, only: [ :index, :buy ]

  def index
    render inertia: "items/index", props: { items: Item.all.map(&:display_hash) }
  end

  def buy
    purchase = Item::Purchase.create(user: current_user, item: @item)

    if purchase.errors.empty?
      flash[:notice] = "Purchased #{@item.name}!"
    else
      flash[:alert] = "You do not have enough tickets to purchase #{@item.name}"
    end

    redirect_to shop_index_path
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end
end
