require "csv"

# Builds a CSV of users who have Hackatime time that hasn't been shipped yet.
#
# For every user with synced Hackatime projects we pull their per-project totals
# and most-recent-heartbeat from Hackatime, drop projects that are already
# shipped or under the time threshold, and keep the single remaining project per
# user with the most recent heartbeat.
#
# Hackatime time isn't stored locally, so the only way to know a user's
# unshipped time is to ask Hackatime — one HTTP request per user. This is a
# long-running sweep (hundreds of users), so it's meant to run in a background
# job: `generate` takes a `progress` callback and processes users in small
# batches with a pause between them to stay gentle on the Hackatime API.
#
# All ActiveRecord access happens up front on the calling thread; the per-batch
# worker threads only do HTTP, so we never contend on the connection pool.
class UnshippedHackatimeReport
  MIN_SECONDS = 30 * 60
  # Users fetched concurrently per batch, and how long we pause between batches.
  # Together these cap the request rate against Hackatime to roughly
  # BATCH_SIZE / (fetch_time + BATCH_PAUSE) requests per second.
  BATCH_SIZE = 8
  BATCH_PAUSE = 1.0
  COLUMNS = %w[
    slack_id username project_to_ship project_id
    has_golden_ticket approved_at last_activity_at
  ].freeze

  Candidate = Struct.new(
    :slack_id, :username, :identifier, :access_token,
    :shipped_names, :project_ids, :has_golden_ticket, :approved_at,
    keyword_init: true
  )

  def self.generate(...)
    new.generate(...)
  end

  # Builds the report, invoking `progress.call(processed, total)` after each
  # batch so a caller (the job) can report progress. Returns a hash with the
  # CSV string and the number of rows it contains.
  def generate(progress: nil)
    candidates = load_candidates
    total = candidates.size
    progress&.call(0, total)

    rows = []
    processed = 0
    candidates.each_slice(BATCH_SIZE).with_index do |batch, index|
      sleep(BATCH_PAUSE) if index.positive?

      fetch_batch(batch).each do |candidate, projects|
        row = build_row(candidate, projects)
        rows << row if row
      end

      processed += batch.size
      progress&.call(processed, total)
    end

    # Most recently active users first.
    rows.sort_by! { |row| row[:last_activity_at].to_s }
    rows.reverse!

    { csv: to_csv(rows), rows_count: rows.size }
  end

  private

  def to_csv(rows)
    CSV.generate do |csv|
      csv << COLUMNS
      rows.each do |row|
        csv << [
          row[:slack_id],
          row[:username],
          row[:project_to_ship],
          row[:project_id],
          row[:has_golden_ticket],
          row[:approved_at]&.iso8601,
          row[:last_activity_at]
        ]
      end
    end
  end

  # Users worth fetching Hackatime data for: they have synced Hackatime
  # projects, aren't banned, and have finished onboarding (a prerequisite for
  # shipping — an un-onboarded user can't act on a "ship your update" nudge).
  def engaged_users
    User.joins(:hackatime_projects).distinct
        .where(is_banned: false, onboarding_completed: true)
  end

  # Loads everything we need from the database in a handful of grouped queries
  # (no per-user lookups) and returns plain structs the worker threads can use
  # without touching ActiveRecord.
  def load_candidates
    user_ids = engaged_users.pluck(:id)
    return [] if user_ids.empty?

    golden_user_ids = Project.where(high_quality: true, user_id: user_ids)
                             .distinct.pluck(:user_id).to_set

    approved_at_by_user = Project.where(user_id: user_ids)
                                 .where.not(approved_at: nil)
                                 .group(:user_id).maximum(:approved_at)

    shipped_names_by_user = Hash.new { |h, k| h[k] = Set.new }
    HackatimeProject.joins(:project)
                    .where(user_id: user_ids)
                    .where.not(projects: { submitted_at: nil })
                    .pluck(:user_id, :name)
                    .each { |uid, name| shipped_names_by_user[uid] << name }

    project_ids_by_user = Hash.new { |h, k| h[k] = {} }
    HackatimeProject.where(user_id: user_ids)
                    .pluck(:user_id, :name, :id)
                    .each { |uid, name, id| project_ids_by_user[uid][name] = id }

    User.where(id: user_ids)
        .select(:id, :slack_id, :username, :hackatime_id, :hackatime_access_token)
        .map do |user|
      Candidate.new(
        slack_id: user.slack_id,
        username: user.username,
        identifier: user.hackatime_id.presence || user.slack_id.presence,
        access_token: user.hackatime_access_token.presence,
        shipped_names: shipped_names_by_user[user.id],
        project_ids: project_ids_by_user[user.id],
        has_golden_ticket: golden_user_ids.include?(user.id),
        approved_at: approved_at_by_user[user.id]
      )
    end
  end

  # Fetches a single batch of candidates concurrently (one thread each) and
  # returns [candidate, projects] pairs. The threads only do HTTP — no
  # ActiveRecord — so they don't touch the connection pool. `projects` is nil
  # when a fetch fails.
  def fetch_batch(batch)
    batch.map do |candidate|
      Thread.new do
        projects = HackatimeService.fetch_project_details(
          identifier: candidate.identifier,
          access_token: candidate.access_token
        )
        [ candidate, projects ]
      end
    end.map(&:value)
  end

  def build_row(candidate, projects)
    return nil if projects.blank?

    chosen = projects
      .reject { |p| sentinel_name?(p["name"]) }
      .select { |p| p["total_seconds"].to_i >= MIN_SECONDS }
      .reject { |p| candidate.shipped_names.include?(p["name"]) }
      .max_by { |p| heartbeat_time(p["most_recent_heartbeat"]) }

    return nil if chosen.nil?

    {
      slack_id: candidate.slack_id,
      username: candidate.username,
      project_to_ship: chosen["name"],
      project_id: candidate.project_ids[chosen["name"]],
      has_golden_ticket: candidate.has_golden_ticket,
      approved_at: candidate.approved_at,
      last_activity_at: chosen["most_recent_heartbeat"]
    }
  end

  # "Other" and WakaTime's "<<LAST_PROJECT>>"-style placeholders aren't real,
  # shippable projects.
  def sentinel_name?(name)
    name.blank? || name == "Other" || name.match?(/\A<<.*>>\z/)
  end

  def heartbeat_time(value)
    Time.iso8601(value.to_s)
  rescue ArgumentError, TypeError
    Time.at(0).utc
  end
end
