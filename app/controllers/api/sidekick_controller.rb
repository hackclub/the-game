class Api::SidekickController < ActionController::API
  before_action :authenticate!

  def handle
    body = begin
      JSON.parse(request.raw_post)
    rescue JSON::ParserError
      return render json: { error: "VALIDATION_ERROR", message: "Invalid JSON body." }, status: :bad_request
    end

    @sidekick_action = body["action"]
    @input = (body["input"] || {}).with_indifferent_access

    result = case @sidekick_action
    when "HEALTH_CHECK" then health_check
    when "GET_PROGRAM_STATS" then get_program_stats
    when "FETCH_PROJECTS" then fetch_projects
    when "FETCH_PROJECT_DETAIL" then fetch_project_detail
    when "FETCH_PROJECT_TIMELINE" then fetch_project_timeline
    when "SUBMIT_REVIEW_ACTION" then submit_review_action
    when "UPDATE_REVIEW_ACTION" then update_review_action
    when "FETCH_SHOP_ITEMS" then fetch_shop_items
    when "FETCH_ORDERS" then fetch_orders
    when "FETCH_ORDER_DETAIL" then fetch_order_detail
    when "REVEAL_ORDER_ADDRESS" then reveal_order_address
    when "UPDATE_ORDER_STATUS" then update_order_status
    when "UPDATE_ORDER_FIELDS" then update_order_fields
    when "UPDATE_ITEM_FIELDS" then update_item_fields
    else
      return render json: { error: "INVALID_ACTION", message: "Unknown action: #{@sidekick_action}" }, status: :bad_request
    end

    render json: result
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: "NOT_FOUND", message: e.message }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: "VALIDATION_ERROR", message: e.record.errors.full_messages.join(", ") }, status: :bad_request
  rescue ArgumentError => e
    render json: { error: "VALIDATION_ERROR", message: e.message }, status: :bad_request
  rescue => e
    Rails.logger.error("[Sidekick] #{@sidekick_action} failed: #{e.class}: #{e.message}\n#{e.backtrace&.first(5)&.join("\n")}")
    render json: { error: "INTERNAL_ERROR", message: e.message }, status: :internal_server_error
  end

  private

  # --- Authentication ---

  def authenticate!
    secret = ENV["SIDEKICK_SECRET"]
    unless secret.present?
      return render json: { error: "UNAUTHORIZED", message: "Sidekick integration not configured." }, status: :unauthorized
    end

    token = request.headers["Authorization"]&.delete_prefix("Bearer ")
    unless token.present? && ActiveSupport::SecurityUtils.secure_compare(token, secret)
      render json: { error: "UNAUTHORIZED", message: "Invalid secret." }, status: :unauthorized
    end
  end

  # --- Actions ---

  def health_check
    { ok: true, version: "1.0.0" }
  end

  def get_program_stats
    {
      pendingReviewCount: Project.where(aasm_state: "submitted").count,
      pendingFulfillmentCount: Item::Purchase.where(aasm_state: "pending").count
    }
  end

  def fetch_projects
    status = @input[:status]
    cursor = @input[:cursor]
    limit = (@input[:limit] || 50).to_i.clamp(1, 100)

    scope = Project.includes(:user, :hackatime_projects, reviews: :author)

    case status
    when "pending"
      scope = scope.where(aasm_state: "submitted")
    when "approved"
      scope = scope.where(
        id: Project::Review.where(review_type: "approval", deleted_at: nil).select(:project_id)
      )
    when "rejected"
      scope = scope.where(
        id: Project::Review.where(review_type: "rejection", deleted_at: nil).select(:project_id)
      )
    end

    total_count = scope.count
    scope = scope.order(created_at: :desc, id: :desc)

    if cursor.present?
      scope = scope.where("projects.id < ?", decode_cursor(cursor))
    end

    projects = scope.limit(limit + 1).to_a
    has_more = projects.length > limit
    projects = projects.first(limit)

    versions_by_project = preload_project_versions(projects)

    response = {
      projects: projects.map { |p| serialize_project(p, versions_by_project[p.id] || []) },
      totalCount: total_count
    }
    response[:nextCursor] = encode_cursor(projects.last.id) if has_more && projects.any?
    response
  end

  def fetch_project_detail
    project = Project.includes(:user, :hackatime_projects, reviews: :author)
                     .find(@input[:projectId])
    serialize_project(project)
  end

  def fetch_project_timeline
    project = Project.includes(reviews: :author).find(@input[:projectId])
    { events: build_timeline(project) }
  end

  def submit_review_action
    ship_id = @input[:shipId]
    reviewer = find_user_by_actor_id!(@input[:reviewerId])
    project = find_project_for_ship!(ship_id)

    review_action = @input[:action]
    event = case review_action
    when "approve"
      review = project.reviews.create!(
        author: reviewer,
        review_type: "approval",
        content: @input[:feedbackMessage],
        admin_content: @input[:justification],
        approved_seconds: (@input[:hoursAssigned].to_f * 3600).to_i
      )
      serialize_approval_event(review, ship_id)
    when "reject"
      review = project.reviews.create!(
        author: reviewer,
        review_type: "rejection",
        content: @input[:feedbackMessage],
        admin_content: @input[:internalMessage].presence || @input[:feedbackMessage]
      )
      serialize_rejection_event(review, ship_id)
    when "comment"
      review = project.reviews.create!(
        author: reviewer,
        review_type: "comment",
        content: @input[:commentText]
      )
      serialize_comment_event(review)
    when "internal_comment"
      review = project.reviews.create!(
        author: reviewer,
        review_type: "comment",
        admin_content: @input[:commentText]
      )
      serialize_comment_event(review, internal: true)
    else
      raise ArgumentError, "Unknown review action: #{review_action}"
    end

    { success: true, event: event }
  end

  def update_review_action
    ship_id = @input[:shipId]
    reviewer = find_user_by_actor_id!(@input[:reviewerId])
    project = find_project_for_ship!(ship_id)
    type = @input[:type]
    review_type = type == "approval" ? "approval" : "rejection"

    review = find_review_for_ship(project, ship_id, reviewer, review_type)

    updates = { content: @input[:feedbackMessage] }
    updates[:admin_content] = @input[:justification] if type == "approval" && @input.key?(:justification)
    updates[:admin_content] = @input[:internalMessage] if type == "rejection" && @input.key?(:internalMessage)

    review.update!(updates)
    { success: true }
  end

  def fetch_shop_items
    { items: Item.all.map { |item| serialize_item(item) } }
  end

  STATUS_EXPR = "CASE WHEN item_purchases.deleted_at IS NOT NULL THEN 'cancelled' " \
                "WHEN item_purchases.aasm_state = 'fulfilled' THEN 'fulfilled' ELSE 'pending' END"
  private_constant :STATUS_EXPR

  ORDER_SORT_SQL = {
    "id" => {
      asc: Arel.sql("item_purchases.id ASC, item_purchases.id ASC"),
      desc: Arel.sql("item_purchases.id DESC, item_purchases.id DESC"),
      asc_cursor: "(item_purchases.id, item_purchases.id) > (?, ?)",
      desc_cursor: "(item_purchases.id, item_purchases.id) < (?, ?)"
    },
    "user" => {
      join: true,
      asc: Arel.sql("COALESCE(users.username, users.first_name, users.email) ASC, item_purchases.id ASC"),
      desc: Arel.sql("COALESCE(users.username, users.first_name, users.email) DESC, item_purchases.id DESC"),
      asc_cursor: "(COALESCE(users.username, users.first_name, users.email), item_purchases.id) > (?, ?)",
      desc_cursor: "(COALESCE(users.username, users.first_name, users.email), item_purchases.id) < (?, ?)"
    },
    "item" => {
      join: true,
      asc: Arel.sql("items.name ASC, item_purchases.id ASC"),
      desc: Arel.sql("items.name DESC, item_purchases.id DESC"),
      asc_cursor: "(items.name, item_purchases.id) > (?, ?)",
      desc_cursor: "(items.name, item_purchases.id) < (?, ?)"
    },
    "quantity" => {
      asc: Arel.sql("item_purchases.quantity ASC, item_purchases.id ASC"),
      desc: Arel.sql("item_purchases.quantity DESC, item_purchases.id DESC"),
      asc_cursor: "(item_purchases.quantity, item_purchases.id) > (?, ?)",
      desc_cursor: "(item_purchases.quantity, item_purchases.id) < (?, ?)"
    },
    "date" => {
      asc: Arel.sql("item_purchases.created_at ASC, item_purchases.id ASC"),
      desc: Arel.sql("item_purchases.created_at DESC, item_purchases.id DESC"),
      asc_cursor: "(item_purchases.created_at, item_purchases.id) > (?, ?)",
      desc_cursor: "(item_purchases.created_at, item_purchases.id) < (?, ?)"
    },
    "status" => {
      asc: Arel.sql("#{STATUS_EXPR} ASC, item_purchases.id ASC"),
      desc: Arel.sql("#{STATUS_EXPR} DESC, item_purchases.id DESC"),
      asc_cursor: "(#{STATUS_EXPR}, item_purchases.id) > (?, ?)",
      desc_cursor: "(#{STATUS_EXPR}, item_purchases.id) < (?, ?)"
    }
  }.freeze

  def fetch_orders
    status = @input[:status]
    search_user = @input[:searchUser]
    cursor = @input[:cursor]
    limit = (@input[:limit] || 50).to_i.clamp(1, 100)
    sort_by = @input[:sortBy] || "date"
    sort_dir = @input[:sortOrder] == "desc" ? :desc : :asc

    sort_sql = ORDER_SORT_SQL[sort_by]
    raise ArgumentError, "Invalid sortBy: #{sort_by}" unless sort_sql

    scope = Item::Purchase.with_deleted
    scope = sort_sql[:join] ? scope.eager_load(:user, :item) : scope.includes(:user, :item)

    case status
    when "pending"
      scope = scope.where(deleted_at: nil, aasm_state: %w[pending hold])
    when "fulfilled"
      scope = scope.where(deleted_at: nil, aasm_state: "fulfilled")
    when "cancelled"
      scope = scope.where.not(deleted_at: nil)
    end

    if search_user.present?
      pattern = "%#{sanitize_sql_like(search_user)}%"
      user_ids = User.where(
        "username ILIKE :q OR email ILIKE :q OR first_name ILIKE :q OR last_name ILIKE :q", q: pattern
      ).pluck(:id)
      scope = scope.where(user_id: user_ids)
    end

    total_count = scope.count

    scope = scope.order(sort_dir == :desc ? sort_sql[:desc] : sort_sql[:asc])

    if cursor.present?
      cursor_val, cursor_id = decode_order_cursor(cursor)
      scope = scope.where(sort_dir == :asc ? sort_sql[:asc_cursor] : sort_sql[:desc_cursor], cursor_val, cursor_id)
    end

    purchases = scope.limit(limit + 1).to_a
    has_more = purchases.length > limit
    purchases = purchases.first(limit)

    items_map = Item.where(id: purchases.map(&:item_id).uniq).each_with_object({}) do |item, hash|
      hash[item.id.to_s] = serialize_item(item)
    end

    response = {
      orders: purchases.map { |p| serialize_order(p) },
      items: items_map,
      totalCount: total_count
    }
    response[:nextCursor] = encode_order_cursor(purchases.last, sort_by) if has_more && purchases.any?
    response
  end

  def fetch_order_detail
    purchase = Item::Purchase.with_deleted.includes(:user, :item).find(@input[:orderId])
    {
      order: serialize_order(purchase),
      item: serialize_item(purchase.item)
    }
  end

  def reveal_order_address
    purchase = Item::Purchase.with_deleted.find(@input[:orderId])
    user = purchase.user

    {
      firstName: user.first_name,
      lastName: user.last_name,
      line1: user.address_street,
      city: user.address_locality,
      stateProvince: user.address_region,
      postalCode: user.address_postal,
      country: user.address_country
    }.compact
  end

  def update_order_status
    purchase = Item::Purchase.with_deleted.find(@input[:orderId])

    case @input[:newStatus]
    when "fulfilled"
      purchase.restore if purchase.deleted?
      was_fulfilled = purchase.fulfilled?
      purchase.fulfill! unless was_fulfilled
      purchase.notify_fulfillment! unless was_fulfilled
    when "pending"
      purchase.restore if purchase.deleted?
      purchase.update_column(:aasm_state, "pending") unless purchase.aasm_state == "pending"
    when "cancelled"
      purchase.destroy unless purchase.deleted?
    else
      raise ArgumentError, "Invalid status: #{@input[:newStatus]}"
    end

    purchase.update!(reference: @input[:reference]) if @input[:reference].present?
    { success: true }
  end

  def update_order_fields
    purchase = Item::Purchase.with_deleted.find(@input[:orderId])
    updates = {}
    updates[:reference] = @input[:reference] if @input.key?(:reference)
    updates[:admin_note] = @input[:adminNotes] if @input.key?(:adminNotes)
    purchase.update!(updates) if updates.any?
    { success: true }
  end

  def update_item_fields
    item = Item.find(@input[:itemId])
    updates = {}
    updates[:fulfiller_context] = @input[:fulfillerContext] if @input.key?(:fulfillerContext)
    item.update!(updates) if updates.any?
    { success: true }
  end

  # --- Serialization ---

  def serialize_project(project, versions = nil)
    {
      id: project.id.to_s,
      title: project.title,
      description: project.desc,
      codeUrl: project.repo_link,
      demoUrl: project.demo_link,
      screenshotUrl: blob_url(project.screenshot),
      authorId: actor_id_for(project.user),
      hackatimeId: project.user.hackatime_id,
      hackatimeProjectKeys: project.hackatime_projects.map(&:name),
      ships: build_ships(project, versions),
      metadata: {}
    }.compact
  end

  def serialize_item(item)
    {
      id: item.id.to_s,
      name: item.name,
      description: item.description,
      fulfillerContext: item.fulfiller_context,
      thumbnailUrl: blob_url(item.image),
      unitPrice: item.price,
      metadata: {}
    }.compact
  end

  def serialize_order(purchase)
    user = purchase.user
    status = if purchase.deleted?
      "cancelled"
    elsif purchase.aasm_state == "fulfilled"
      "fulfilled"
    else
      "pending"
    end

    {
      id: purchase.id.to_s,
      userId: actor_id_for(user),
      userName: user.username || user.first_name || user.email,
      userEmail: user.email,
      userAvatarUrl: user.avatar,
      itemId: purchase.item_id.to_s,
      quantity: purchase.quantity,
      totalPrice: purchase.amount_paid,
      status: status,
      reference: purchase.reference,
      adminNotes: purchase.admin_note,
      createdAt: purchase.created_at.iso8601,
      fulfilledAt: purchase.fulfilled_at&.iso8601,
      metadata: {}
    }.compact
  end

  # --- Ships ---

  def build_ships(project, all_versions = nil)
    all_versions ||= project.versions.order(:created_at, :id).to_a

    submission_versions = all_versions.select do |v|
      v.object_changes&.dig("aasm_state", 1) == "submitted"
    end

    reviews = project.reviews
      .where(review_type: %w[approval rejection], deleted_at: nil)
      .order(:created_at)
      .to_a

    submission_versions.each_with_index.map do |version, i|
      submitted_at = version.created_at
      next_submitted_at = submission_versions[i + 1]&.created_at

      review = reviews.find do |r|
        r.created_at >= submitted_at && (next_submitted_at.nil? || r.created_at < next_submitted_at)
      end

      status = case review&.review_type
      when "approval" then "approved"
      when "rejection" then "rejected"
      else "pending"
      end

      {
        id: "v#{version.id}",
        hoursSubmitted: submission_hours(project, version, all_versions),
        submittedAt: submitted_at.iso8601,
        status: status
      }
    end
  end

  def submission_hours(project, version, all_versions)
    idx = all_versions.index { |v| v.id == version.id }
    next_ver = idx ? all_versions[idx + 1] : nil

    total_seconds = if next_ver&.object_changes&.key?("total_seconds")
      next_ver.object_changes["total_seconds"][1]
    elsif project.submitted?
      project.total_seconds
    else
      0
    end

    (total_seconds || 0) / 3600.0
  end

  # --- Timeline ---

  def build_timeline(project)
    events = []
    all_versions = project.versions.order(:created_at, :id).to_a

    submission_versions = all_versions.select do |v|
      v.object_changes&.dig("aasm_state", 1) == "submitted"
    end

    submission_versions.each_with_index do |version, i|
      prev = i > 0 ? submission_versions[i - 1] : nil
      events << build_ship_event(project, version, prev, all_versions)
    end

    project.reviews.includes(:author).order(:created_at).each do |review|
      ship_id = find_ship_id_for_review(review, submission_versions)
      events << case review.review_type
      when "approval"
        serialize_approval_event(review, ship_id)
      when "rejection"
        serialize_rejection_event(review, ship_id)
      when "comment"
        internal = review.content.blank? && review.admin_content.present?
        serialize_comment_event(review, internal: internal)
      end
    end

    events.compact.sort_by { |e| e[:timestamp] }
  end

  def build_ship_event(project, version, prev_version, all_versions)
    ship_id = "v#{version.id}"
    changes = prev_version ? compute_changes(version, prev_version) : []

    event = {
      type: "ship",
      shipId: ship_id,
      actorId: version_actor_id(version, project),
      hoursSubmitted: submission_hours(project, version, all_versions),
      timestamp: version.created_at.iso8601
    }
    event[:changes] = changes if changes.any?
    event
  end

  FIELD_CONFIG = {
    "title" => { field: "title", label: "Title", diffType: "text" },
    "desc" => { field: "description", label: "Description", diffType: "text" },
    "demo_link" => { field: "demoUrl", label: "Demo URL", diffType: "url" },
    "repo_link" => { field: "codeUrl", label: "Code URL", diffType: "url" }
  }.freeze

  def compute_changes(version, prev_version)
    current = version.reify
    previous = prev_version.reify
    return [] unless current && previous

    FIELD_CONFIG.filter_map do |attr, config|
      old_val = previous.send(attr).to_s
      new_val = current.send(attr).to_s
      next if old_val == new_val

      {
        field: config[:field],
        label: config[:label],
        oldValue: old_val,
        newValue: new_val,
        diffType: config[:diffType]
      }
    end
  end

  def find_ship_id_for_review(review, submission_versions)
    version = submission_versions.reverse.find { |v| v.created_at <= review.created_at }
    version ? "v#{version.id}" : nil
  end

  # --- Timeline event serializers ---

  def serialize_approval_event(review, ship_id)
    {
      type: "approval",
      shipId: ship_id,
      actorId: actor_id_for(review.author),
      hoursAssigned: review.approved_seconds / 3600.0,
      feedbackMessage: review.content || "",
      justification: review.admin_content || "",
      timestamp: review.created_at.iso8601
    }
  end

  def serialize_rejection_event(review, ship_id)
    event = {
      type: "rejection",
      shipId: ship_id,
      actorId: actor_id_for(review.author),
      feedbackMessage: review.content || "",
      timestamp: review.created_at.iso8601
    }
    event[:internalMessage] = review.admin_content if review.admin_content.present?
    event
  end

  def serialize_comment_event(review, internal: false)
    {
      type: "comment",
      actorId: actor_id_for(review.author),
      message: internal ? review.admin_content : review.content,
      isInternal: internal,
      timestamp: review.created_at.iso8601
    }
  end

  # --- Helpers ---

  def actor_id_for(user)
    return user.slack_id if user.slack_id.present?
    return "ident!#{user.account_id}" if user.account_id.present?
    "user_#{user.id}"
  end

  def version_actor_id(version, project)
    if version.whodunnit.present?
      user = User.find_by(id: version.whodunnit)
      return actor_id_for(user) if user
    end
    actor_id_for(project.user)
  end

  def find_user_by_actor_id!(actor_id)
    if actor_id.start_with?("ident!")
      User.find_by!(account_id: actor_id.delete_prefix("ident!"))
    elsif actor_id.start_with?("U")
      User.find_by!(slack_id: actor_id)
    else
      raise ActiveRecord::RecordNotFound, "No user found for actor ID: #{actor_id}"
    end
  end

  def find_project_for_ship!(ship_id)
    version_id = ship_id.delete_prefix("v").to_i
    version = PaperTrail::Version.find(version_id)
    raise ActiveRecord::RecordNotFound, "Ship does not reference a project" unless version.item_type == "Project"
    Project.find(version.item_id)
  end

  def find_review_for_ship(project, ship_id, reviewer, review_type)
    version_id = ship_id.delete_prefix("v").to_i
    version = PaperTrail::Version.find(version_id)
    submitted_at = version.created_at

    next_submission = project.versions
      .where("created_at > ?", submitted_at)
      .order(:created_at)
      .to_a
      .find { |v| v.object_changes&.dig("aasm_state", 1) == "submitted" }

    scope = project.reviews
      .where(author: reviewer, review_type: review_type)
      .where("created_at >= ?", submitted_at)

    scope = scope.where("created_at < ?", next_submission.created_at) if next_submission
    scope.first!
  end

  def preload_project_versions(projects)
    PaperTrail::Version
      .where(item_type: "Project", item_id: projects.map(&:id))
      .order(:created_at, :id)
      .to_a
      .group_by(&:item_id)
  end

  def blob_url(attachment)
    return nil unless attachment.attached? && attachment.persisted?
    "#{request.base_url}/rails/active_storage/blobs/redirect/#{attachment.blob.signed_id}/#{attachment.blob.filename}"
  end

  def encode_cursor(id)
    Base64.strict_encode64(id.to_s)
  end

  def decode_cursor(cursor)
    Base64.decode64(cursor).to_i
  end

  def encode_order_cursor(purchase, sort_by)
    val = case sort_by
    when "id" then purchase.id
    when "user"
      user = purchase.user
      user.username || user.first_name || user.email
    when "item" then purchase.item.name
    when "quantity" then purchase.quantity
    when "date" then purchase.created_at.utc.iso8601(6)
    when "status"
      purchase.deleted? ? "cancelled" : (purchase.aasm_state == "fulfilled" ? "fulfilled" : "pending")
    end
    Base64.strict_encode64(JSON.generate([ val, purchase.id ]))
  end

  def decode_order_cursor(cursor)
    JSON.parse(Base64.decode64(cursor))
  end

  def sanitize_sql_like(string)
    string.gsub(/[\\%_]/) { |x| "\\#{x}" }
  end
end
