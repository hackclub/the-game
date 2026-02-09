class ItemsController < ApplicationController
  before_action :set_item, only: [ :buy, :edit, :update, :destroy ]
  before_action :signed_in_admin, only: [ :create, :edit, :update, :destroy ]
  skip_after_action :verify_authorized, only: [ :index, :buy, :create, :edit, :update, :destroy ]

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

  def create
    Item.create!(item_params)

    inertia_location admin_items_path
  end

  def edit
    render inertia: "items/edit", props: { item: @item }
  end

  def update
    @item.update!(item_params)

    redirect_to admin_items_path
  end

  def destroy
    @item.destroy!

    redirect_to admin_items_path
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:name, :description, :price)
  end
end
