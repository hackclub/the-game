class AdminController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_admin

  def index
    render inertia: "admin/index"
  end

  def announcements
    render inertia: "admin/announcements"
  end

  def projects
    filtered_projects = Project.all

    if params[:status].present?
      filtered_projects = filtered_projects.where(aasm_state: params[:status])
    end

    if params[:high_quality] == "true"
      filtered_projects = filtered_projects.where(high_quality: true)
    end

    if params[:tag].presence.present?
      filtered_projects = filtered_projects.joins(:tags).where(tags: { id: Project::Tag.find_by(name: params[:tag]) })
    end

    if params[:q].present?
      filtered_projects = filtered_projects.search_by_title(params[:q])
    end

    paginated_projects = filtered_projects.order(created_at: :desc).page(params[:page]).per(10)
    render inertia: "admin/projects", props: {
      projects: paginated_projects.map { |project| project.display_hash(user: true) },
      q: params[:q],
      status: params[:status],
      high_quality: params[:high_quality] == "true",
      tag: params[:tag],
      available_tags: Project::Tag.all.map(&:display_hash),
      pagination: {
        current_page: paginated_projects.current_page,
        next_page: paginated_projects.next_page,
        prev_page: paginated_projects.prev_page,
        total_pages: paginated_projects.total_pages,
        total_count: paginated_projects.total_count
      }
    }
  end

  def users
    filtered_users = User.all

    if params[:q].present?
      slack_id_pattern = /\A(?:https:\/\/[a-z0-9.]+\.slack\.com\/team\/)?(U[A-Z0-9]{8,})\z/
      if (match = params[:q].strip.match(slack_id_pattern))
        filtered_users = filtered_users.where(slack_id: match[1])
      else
        filtered_users = filtered_users.search_by_name(params[:q])
      end
    end

    if params[:role].present?
      filtered_users = filtered_users.where(role: params[:role])
    end

    paginated_users = filtered_users.order(created_at: :desc).page(params[:page]).per(10)

    render inertia: "admin/users", props: {
      users: paginated_users.map { |user| user.display_hash(private: true) },
      role: params[:role],
      q: params[:q],
      pagination: {
        current_page: paginated_users.current_page,
        next_page: paginated_users.next_page,
        prev_page: paginated_users.prev_page,
        total_pages: paginated_users.total_pages,
        total_count: paginated_users.total_count
      }
    }
  end

  def items
    render inertia: "admin/items", props: { items: Item.all.map(&:display_hash) }
  end

  def stats
    invite_purchase_count = Item::Purchase.where(item_id: Item::INVITE_ID).count

    orders_by_date = Item::Purchase.where.not(aasm_state: :fulfilled)
                                   .group("DATE(created_at)")
                                   .count
    if orders_by_date.any?
      first_date = orders_by_date.keys.min
      orders_over_time = (first_date..Date.current).map { |date| { date: date.to_s, count: orders_by_date[date] || 0 } }
    else
      orders_over_time = []
    end

    invite_orders_by_date = Item::Purchase.where(item_id: Item::INVITE_ID)
                                          .group("DATE(created_at)")
                                          .count
    if invite_orders_by_date.any?
      first_date = invite_orders_by_date.keys.min
      invite_orders_over_time = (first_date..Date.current).map { |date| { date: date.to_s, count: invite_orders_by_date[date] || 0 } }

      event_date = Date.new(2026, 5, 22)
      days_until_event = (event_date - Date.current).to_i
      days_elapsed = (Date.current - first_date).to_i + 1
      daily_rate = invite_purchase_count / days_elapsed.to_f
      invite_projected_count = (invite_purchase_count + daily_rate * days_until_event).round
    else
      invite_orders_over_time = []
      invite_projected_count = nil
    end

    render inertia: "admin/stats", props: {
      stats: Statistic.generate_statistic_data,
      invite_purchase_count:,
      invite_projected_count:,
      orders_over_time:,
      invite_orders_over_time:
    }
  end

  def orders
    filtered_orders = Item::Purchase.includes(:user, :item)

    if params[:status].present?
      filtered_orders = filtered_orders.where(aasm_state: params[:status])
    end

    if params[:item_id].present?
      filtered_orders = filtered_orders.where(item_id: params[:item_id])
    end

    if params[:user_id].present?
      filtered_orders = filtered_orders.where(user_id: params[:user_id])
    end

    paginated_orders = filtered_orders.order(created_at: :desc).page(params[:page]).per(10)

    render inertia: "admin/orders", props: {
      orders: paginated_orders,
      items: Item.all.order(name: :asc).map(&:display_hash),
      users: User.all.order(username: :asc).map(&:display_hash),
      status: params[:status],
      item_id: params[:item_id],
      user_id: params[:user_id],
      pagination: {
        current_page: paginated_orders.current_page,
        next_page: paginated_orders.next_page,
        prev_page: paginated_orders.prev_page,
        total_pages: paginated_orders.total_pages,
        total_count: paginated_orders.total_count
      }
    }
  end
end
