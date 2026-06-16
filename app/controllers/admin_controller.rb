class AdminController < ApplicationController
  skip_after_action :verify_authorized
  before_action :signed_in_admin, except: [ :index, :orders, :ticket_transfers, :grants, :grants_csv, :users ]
  before_action :signed_in_fulfiller, only: [ :index, :orders, :ticket_transfers, :grants, :grants_csv, :users ]

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

    if params[:permission].present?
      case params[:permission]
      when "admin"
        filtered_users = filtered_users.where(is_admin: true)
      when "reviewer"
        filtered_users = filtered_users.where(is_reviewer: true)
      when "fulfiller"
        filtered_users = filtered_users.where(is_fulfiller: true)
      end
    end

    paginated_users = filtered_users.order(created_at: :desc).page(params[:page]).per(10)

    render inertia: "admin/users", props: {
      users: paginated_users.map { |user| user.display_hash(private: true) },
      permission: params[:permission],
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
    categories = Item.where.not(category: nil).distinct.pluck(:category).sort
    render inertia: "admin/items", props: { items: Item.all.map(&:display_hash), categories: }
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

  def users_search
    users = User.search_by_name(params[:q]).limit(8)
    render json: users.map { |u| { id: u.id, username: u.username, avatar: u.avatar } }
  end

  def audit_log
    versions = PaperTrail::Version.all

    if params[:item_type].present?
      versions = versions.where(item_type: params[:item_type])
    end

    if params[:event].present?
      versions = versions.where(event: params[:event])
    end

    whodunnit_user = nil
    if params[:whodunnit].present?
      whodunnit_user = User.find_by(id: params[:whodunnit])
      versions = whodunnit_user ? versions.where(whodunnit: whodunnit_user.id.to_s) : versions.none
    end

    if params[:date_from].present?
      versions = versions.where("created_at >= ?", params[:date_from].to_date.beginning_of_day)
    end

    if params[:date_to].present?
      versions = versions.where("created_at <= ?", params[:date_to].to_date.end_of_day)
    end

    paginated = versions.order(created_at: :desc).page(params[:page]).per(50)

    whodunnit_ids = paginated.map(&:whodunnit).compact.uniq
    users_by_id = User.where(id: whodunnit_ids).index_by { |u| u.id.to_s }

    # Fields that must never be sent to the frontend in object_changes diffs,
    # regardless of encryption — PaperTrail may capture plaintext at change-time.
    sensitive_fields = {
      "User" => %w[account_access_token hackatime_access_token]
    }

    entries = paginated.map do |v|
      actor = users_by_id[v.whodunnit]
      changes = v.object_changes
      if changes.is_a?(Hash)
        blocked = sensitive_fields[v.item_type]
        changes = changes.except(*blocked) if blocked
      end
      {
        id: v.id,
        item_type: v.item_type,
        item_id: v.item_id,
        event: v.event,
        whodunnit: v.whodunnit,
        whodunnit_user: actor ? { id: actor.id, username: actor.username, avatar: actor.avatar } : nil,
        object_changes: changes,
        created_at: v.created_at
      }
    end

    item_types = PaperTrail::Version.distinct.pluck(:item_type).sort

    render inertia: "admin/audit-log", props: {
      entries:,
      item_types:,
      item_type: params[:item_type],
      event: params[:event],
      whodunnit: params[:whodunnit],
      whodunnit_user: whodunnit_user ? { id: whodunnit_user.id, username: whodunnit_user.username, avatar: whodunnit_user.avatar } : nil,
      date_from: params[:date_from],
      date_to: params[:date_to],
      pagination: {
        current_page: paginated.current_page,
        next_page: paginated.next_page,
        prev_page: paginated.prev_page,
        total_pages: paginated.total_pages,
        total_count: paginated.total_count
      }
    }
  end

  def update_user_permissions
    user = User.find(params[:id])
    user.update!(
      is_admin: params[:is_admin] == "true",
      is_reviewer: params[:is_reviewer] == "true",
      is_fulfiller: params[:is_fulfiller] == "true"
    )
    redirect_to admin_user_path(user), notice: "Permissions updated"
  end

  def user_hackatime_projects
    user = User.find(params[:id])
    render json: user.hackatime_projects.map(&:display_hash)
  end

  def sync_user_to_platform
    user = User.find(params[:id])
    PlatformAuthorizationService.authorize!(user)
    flash[:notice] = "Successfully synced #{user.username} to the IRL platform."
  rescue => e
    flash[:alert] = "Failed to sync #{user&.username || "user"} to platform: #{e.message}"
  ensure
    redirect_back(fallback_location: "/admin/users")
  end

  def orders
    params[:status] = "pending" if params[:status].nil?

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

    paginated_orders = filtered_orders.order(created_at: :desc).page(params[:page]).per(30)

    render inertia: "admin/orders", props: {
      orders: paginated_orders.map { |o| o.display_hash(item: true).merge(username: o.user&.username) },
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

  def ticket_transfers
    params[:status] = "pending" if params[:status].nil?

    filtered_transfers = TicketTransfer.all

    if params[:status].present?
      filtered_transfers = filtered_transfers.where(aasm_state: params[:status])
    end

    paginated_transfers = filtered_transfers.order(created_at: :desc).page(params[:page]).per(10)

    render inertia: "admin/ticket_transfers", props: {
      transfers: paginated_transfers.map { |transfer| transfer.display_hash(private: true) },
      status: params[:status],
      users: User.all.order(username: :asc).map(&:display_hash),
      pagination: {
        current_page: paginated_transfers.current_page,
        next_page: paginated_transfers.next_page,
        prev_page: paginated_transfers.prev_page,
        total_pages: paginated_transfers.total_pages,
        total_count: paginated_transfers.total_count
      }
    }
  end

  def budget
    items = Item.all.order(:name).map do |item|
      {
        id: item.id,
        name: item.name,
        price: item.price,
        real_price: item.real_price&.to_f,
        category: item.category
      }
    end

    orders = Item::Purchase.where(aasm_state: :pending).includes(:user, :item).order(created_at: :desc).map do |o|
      {
        id: o.id,
        item_id: o.item_id,
        item_name: o.item.name,
        user_id: o.user_id,
        username: o.user&.username,
        quantity: o.quantity,
        amount_paid: o.amount_paid,
        aasm_state: o.aasm_state,
        created_at: o.created_at
      }
    end

    excluded_user_ids = [ 424, 539, 399 ]
    users = User.where.not(id: excluded_user_ids)
      .includes(:approved_reviews, :purchases, :ticket_adjustments, :incoming_ticket_transfers, :outgoing_ticket_transfers)

    total_user_balance_tickets = users.sum { |u| u.balance }

    render inertia: "admin/budget", props: {
      items:,
      orders:,
      total_user_balance_tickets:
    }
  end

  def update_item_real_price
    item = Item.find(params[:id])
    item.update!(real_price: params[:real_price])
    head :ok
  end

  def grants
    items = Item.where(category: "grants").map do |item|
      item.display_hash.merge("pending_count" => Item::Purchase.where(item_id: item.id, aasm_state: [ :pending, :hold ]).count)
    end
    render inertia: "admin/grants", props: { items: }
  end

  def grants_csv
    require "csv"

    item = Item.find(params[:item_id])
    amount_cents = params[:amount_cents].to_i
    purpose = params[:purpose].to_s.truncate(30)
    one_time_use = ActiveModel::Type::Boolean.new.cast(params[:one_time_use])
    merchant_lock = params[:merchant_lock].to_s
    invite_message = params[:invite_message].to_s

    orders = Item::Purchase.where(item_id: item.id, aasm_state: [ :pending, :hold ]).includes(:user)

    csv = CSV.generate(headers: true) do |csv|
      csv << [ "email", "amount_cents", "purpose", "one_time_use", "invite_message", "merchant_lock", "category_lock", "keyword_lock", "banned_merchants", "banned_categories" ]
      orders.each do |order|
        csv << [ order.user.email, amount_cents * order.quantity, purpose, one_time_use, invite_message, merchant_lock, "", "", "", "" ]
      end
    end

    send_data csv, filename: "#{item.name.parameterize}-grants.csv", type: "text/csv", disposition: "attachment"
  end
end
