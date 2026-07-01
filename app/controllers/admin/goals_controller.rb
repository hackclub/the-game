module Admin
  class GoalsController < ApplicationController
    before_action :signed_in_admin
    skip_after_action :verify_authorized

    def index
      render inertia: "admin/goals", props: {
        goals: Goal.ordered.includes(:item).map(&:display_hash),
        items: Item.order(:name).map { |item| item.display_hash }
      }
    end

    def create
      item = Item.find(params[:item_id])
      unless Goal.exists?(item: item)
        Goal.create!(item: item, position: (Goal.maximum(:position) || 0) + 1)
      end

      redirect_back_or_to admin_goals_path
    end

    def destroy
      Goal.find(params[:id]).destroy!

      redirect_back_or_to admin_goals_path
    end
  end
end
