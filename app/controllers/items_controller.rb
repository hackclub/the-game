class ItemsController < ApplicationController
  before_action :set_item, only: [ :buy, :edit, :update, :destroy ]
  before_action :signed_in_admin, only: [ :create, :edit, :update, :destroy ]
  skip_after_action :verify_authorized, only: [ :index, :buy, :create, :edit, :update, :destroy ]

  def index
    render inertia: "items/index", props: { items: Item.with_attached_image.order(featured: :desc).map(&:display_hash), has_purchased: current_user.purchases.any? }
  end

  def buy
    quantity = [ params.fetch(:quantity, 1).to_i, 1 ].max
    purchase = Item::Purchase.create(user: current_user, item: @item, quantity: quantity)

    if purchase.errors.empty?
      track_event("item_purchased", {
        item_id: @item.id,
        item_name: @item.name,
        item_price: @item.price,
        quantity: quantity
      })
      flash[:notice] = "Purchased #{quantity}x #{@item.name}!"
    else
      track_event("item_purchase_failed", {
        item_id: @item.id,
        item_name: @item.name,
        reason: "insufficient_tickets"
      })
      flash[:alert] = "You do not have enough tickets to purchase #{@item.name}"
    end

    redirect_to shop_index_path
  end

  def create
    Item.create!(item_params)

    inertia_location admin_items_path
  end

  def edit
    render inertia: "items/edit", props: { item: @item.display_hash }
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
    p = params.permit(:name, :description, :price, :featured)
    p[:featured] = ActiveModel::Type::Boolean.new.cast(p[:featured]) || false

    unless params[:image] == "0"
      p[:image] = params[:image]
    end

    p
  end
end
