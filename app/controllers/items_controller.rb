class ItemsController < ApplicationController
  before_action :set_item, only: [ :buy, :claim_referral_item, :edit, :update, :destroy ]
  before_action :signed_in_admin, only: [ :create, :edit, :update, :destroy ]
  skip_after_action :verify_authorized, only: [ :index, :buy, :claim_referral_item, :create, :edit, :update, :destroy ]

  def index
    program = ReferralProgram.instance
    referral = Referral.find_by(referred_user_id: current_user.id)
    referred_item = nil

    if referral.present? && program.referred_item.present?
      item = program.referred_item
      already_claimed = current_user.purchases.where(item: item).exists?
      referred_item = item.display_hash.merge("already_claimed" => already_claimed) unless already_claimed
    end

    purchased_item_ids = current_user.purchases.pluck(:item_id).uniq

    items_scope = Item.with_attached_image.order(featured: :desc, price: :asc)
    items_scope = items_scope.where.not(id: program.referred_item_id) if program.referred_item_id.present?

    render inertia: "items/index", props: {
      items: items_scope.map(&:display_hash),
      has_purchased: current_user.purchases.any?,
      referred_item: referred_item,
      purchased_item_ids: purchased_item_ids
    }
  end

  def claim_referral_item
    program = ReferralProgram.instance
    referral = Referral.find_by(referred_user_id: current_user.id)

    unless referral.present? && program.referred_item.present? && program.referred_item.id == @item.id
      redirect_to shop_index_path, alert: "You are not eligible for this item."
      return
    end

    if current_user.purchases.where(item: @item).exists?
      redirect_to shop_index_path, alert: "You have already claimed this item."
      return
    end

    unless current_user.idv_verified?
      redirect_to shop_index_path, alert: "Verify your identity to be able to buy items from the shop."
      return
    end

    Item::Purchase.create!(user: current_user, item: @item, quantity: 1, skip_balance_check: true)
    track_event("referral_item_claimed", { item_id: @item.id, item_name: @item.name })
    redirect_to shop_index_path, notice: "Claimed #{@item.name}!"
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
    elsif !current_user.idv_verified?
      track_event("item_purchase_failed", {
        item_id: @item.id,
        item_name: @item.name,
        reason: "idv_not_verified"
      })
      flash[:alert] = "Verify your identity to be able to buy items from the shop."
    else
      reason = @item.one_per_user? && current_user.purchases.where(item: @item).exists? ? "already_purchased" : "insufficient_tickets"
      track_event("item_purchase_failed", {
        item_id: @item.id,
        item_name: @item.name,
        reason: reason
      })
      flash[:alert] = reason == "already_purchased" ? "You have already purchased #{@item.name}" : "You do not have enough tickets to purchase #{@item.name}"
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
    p = params.permit(:name, :description, :price, :featured, :one_per_user)
    p[:featured] = ActiveModel::Type::Boolean.new.cast(p[:featured]) || false
    p[:one_per_user] = ActiveModel::Type::Boolean.new.cast(p[:one_per_user]) || false

    unless params[:image] == "0"
      p[:image] = params[:image]
    end

    p
  end
end
