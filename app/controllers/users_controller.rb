class UsersController < ApplicationController
  include ActionView::Helpers::TextHelper

  def show
    if params[:id].present? && !current_user.admin? && !current_user.fulfiller?
      raise Pundit::NotAuthorizedError
    end

    skip_authorization

    user = params[:id].present? ? User.find(params[:id]) : current_user

    user.mark_adjustment_notifications_read

    approved_items = user.approved_reviews.map { |review| { name: "\"#{review.project.title}\" was approved for #{review.approved_words}", date: review.created_at, link: project_path(review.project) } }
    adjustment_items = user.ticket_adjustments.map { |adjustment| { name: "#{adjustment.amount.positive? ? "Extra" : "Deducted"} #{pluralize(adjustment.amount, "ticket")}", date: adjustment.created_at } }
    purchase_items = user.purchases.map { |purchase| { name: "Purchased #{"#{purchase.quantity}x" if purchase.quantity > 1} \"#{purchase.item.name}\" for #{pluralize(purchase.amount_paid, "ticket")}", date: purchase.created_at, link: current_user.admin? ? order_path(purchase) : orders_path } }

    unsorted_timeline = approved_items + adjustment_items + purchase_items
    timeline = unsorted_timeline.sort_by { |item| item[:date] }

    orders_scope = params[:id].present? ? user.purchases.with_deleted : user.purchases

    render inertia: "users/show", props: { page_user: user.display_hash(private: true, admin: current_user.admin?), custom: params[:id].present?, timeline:, orders: orders_scope.map { |order| order.display_hash(item: true) } }
  end

  def display
    skip_authorization

    user = User.find(params[:id])
    projects = user.projects.includes(:user).where("approved_seconds > 0 OR aasm_state = ?", "approved").order(approved_at: :desc, created_at: :desc)

    render inertia: "users/display", props: {
      page_user: user.display_hash,
      projects: projects.map { |p| p.display_hash.merge(username: p.user&.username) }
    }
  end
end
