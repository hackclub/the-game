class ItemsController < ApplicationController
  before_action :set_item, only: [ :buy, :claim_referral_item, :edit, :update, :destroy ]
  before_action :signed_in_admin, only: [ :create, :edit, :update, :destroy, :bulk_adjust_price, :bulk_set_category, :bulk_set_golden_price, :revert_price_changes, :preview_price_revert ]
  skip_after_action :verify_authorized, only: [ :index, :buy, :claim_referral_item, :create, :edit, :update, :destroy, :bulk_adjust_price, :bulk_set_category, :bulk_set_golden_price, :revert_price_changes, :preview_price_revert ]

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

    items_scope = Item.visible.with_attached_image.order(super_featured: :desc, featured: :desc, price: :asc)
    items_scope = items_scope.where.not(id: program.referred_item_id) if program.referred_item_id.present?

    goal_by_item = current_user.admin? ? Goal.pluck(:item_id, :id).to_h : {}

    render inertia: "items/index", props: {
      items: items_scope.map { |item| item.display_hash(true) },
      has_purchased: current_user.purchases.any?,
      referred_item: referred_item,
      purchased_item_ids: purchased_item_ids,
      goal_by_item: goal_by_item
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
    purchase = Item::Purchase.create(user: current_user, item: @item, quantity: quantity, note: params[:note])

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
    elsif @item.black_market && !current_user.wizard?
      track_event("item_purchase_failed", {
        item_id: @item.id,
        item_name: @item.name,
        reason: "black_market"
      })
      flash[:alert] = "A golden ticket is required to purchase this item."
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

  def bulk_adjust_price
    item_ids = Array(params[:item_ids]).map(&:to_i)
    percentage = params[:percentage].to_f

    Item.where(id: item_ids).each do |item|
      new_price = [ (item.price * (1 + percentage / 100.0)).round, 1 ].max
      item.update!(price: new_price)
    end

    inertia_location admin_items_path
  end

  def preview_price_revert
    preview = []
    Item.find_each do |item|
      version = item.versions.reverse_each.find do |v|
        v.object_changes.is_a?(Hash) && v.object_changes.key?("price")
      end
      next unless version

      preview << {
        id: item.id,
        name: item.name,
        current_price: item.price,
        revert_to: version.object_changes["price"][0],
        changed_at: version.created_at
      }
    end

    render json: preview
  end

  def revert_price_changes
    scope = params[:item_ids].present? ? Item.where(id: Array(params[:item_ids]).map(&:to_i)) : Item.all
    reverted = 0
    scope.find_each do |item|
      price_change_version = item.versions.reverse_each.find do |v|
        v.object_changes.is_a?(Hash) && v.object_changes.key?("price")
      end
      next unless price_change_version

      old_price = price_change_version.object_changes["price"][0]
      item.update!(price: old_price)
      reverted += 1
    end

    flash[:notice] = "Reverted prices for #{reverted} item#{"s" if reverted != 1}"
    inertia_location admin_items_path
  end

  def bulk_set_category
    item_ids = Array(params[:item_ids]).map(&:to_i)
    category = params[:category].presence

    Item.where(id: item_ids).update_all(category: category)

    inertia_location admin_items_path
  end

  # Mass-assigns a golden ticket price to every item as a discount off its
  # regular price. The discount is a percentage and the resulting price is
  # always rounded up. A discount of 0 clears golden prices entirely.
  def bulk_set_golden_price
    discount = params[:discount].to_f.clamp(0, 100)

    Item.find_each do |item|
      golden = discount.zero? ? nil : [ (item.price * (1 - discount / 100.0)).ceil, 0 ].max
      item.update!(golden_price: golden)
    end

    inertia_location admin_items_path
  end

  def create
    Item.create!(item_params)

    inertia_location admin_items_path
  end

  def edit
    versions = @item.versions.filter_map do |version|
      real_changes = version.object_changes
      next if real_changes.nil?
      real_changes.delete("updated_at")
      { timestamp: version.created_at, changes: real_changes }
    end

    categories = Item.where.not(category: nil).distinct.pluck(:category).sort
    render inertia: "items/edit", props: { item: @item.display_hash, versions:, categories: }
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
    p = params.permit(:name, :description, :price, :golden_price, :real_price, :featured, :super_featured, :one_per_user, :stock, :black_market, :event_related, :grants_platform_access, :visible, :category)
    p[:golden_price] = p[:golden_price].presence
    p[:featured] = ActiveModel::Type::Boolean.new.cast(p[:featured]) || false
    p[:super_featured] = ActiveModel::Type::Boolean.new.cast(p[:super_featured]) || false
    p[:one_per_user] = ActiveModel::Type::Boolean.new.cast(p[:one_per_user]) || false
    p[:black_market] = ActiveModel::Type::Boolean.new.cast(p[:black_market]) || false
    p[:event_related] = ActiveModel::Type::Boolean.new.cast(p[:event_related]) || false
    p[:grants_platform_access] = ActiveModel::Type::Boolean.new.cast(p[:grants_platform_access]) || false
    p[:visible] = ActiveModel::Type::Boolean.new.cast(p[:visible]) || false

    unless params[:image] == "0"
      p[:image] = params[:image]
    end

    p
  end
end
