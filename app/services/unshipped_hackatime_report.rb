require "csv"

# Builds a CSV of users who have Hackatime time that hasn't been shipped yet.
#
# For every user with synced Hackatime projects we pull their per-project totals
# and most-recent-heartbeat from Hackatime, drop projects that are already
# shipped or under the time threshold, and keep the single remaining project per
# user with the most recent heartbeat.
#
# Hackatime data is fetched live (one HTTP request per user), so the work is
# fanned out across a bounded thread pool. All ActiveRecord access happens up
# front on the calling thread — the worker threads only do HTTP — so we never
# contend on the connection pool.
#
# Hackatime time isn't stored locally, so the only way to know a user's
# unshipped time is to ask Hackatime. To avoid fetching for users who won't act
# on a "ship your update" nudge anyway, we first narrow to engaged candidates
# using cheap database signals (not banned, onboarded, recently active on the
# platform) and only fetch for those. `active_within_days` controls the
# recency window; pass nil/0 to fetch for every Hackatime user.
#
# Note: `last_active` tracks platform (web) activity, not Hackatime coding
# activity — a heads-down coder who hasn't opened the site recently is filtered
# out. Widen the window if you want to reach them too.
class UnshippedHackatimeReport
  MIN_SECONDS = 30 * 60
  THREADS = 20
  DEFAULT_ACTIVE_WITHIN_DAYS = 30
  COLUMNS = %w[
    slack_id username project_to_ship project_id
    has_golden_ticket approved_at last_activity_at
  ].freeze

  Candidate = Struct.new(
    :slack_id, :username, :identifier, :access_token,
    :shipped_names, :project_ids, :has_golden_ticket, :approved_at,
    keyword_init: true
  )

  def self.generate_csv(...)
    new(...).generate_csv
  end

  def initialize(active_within_days: DEFAULT_ACTIVE_WITHIN_DAYS)
    @active_within_days = active_within_days
  end

  def generate_csv
    rows = build_rows

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

  private

  def build_rows
    candidates = load_candidates

    rows = fetch_in_parallel(candidates).filter_map do |candidate, projects|
      build_row(candidate, projects)
    end

    # Most recently active users first.
    rows.sort_by { |row| row[:last_activity_at].to_s }.reverse
  end

  # The set of users worth fetching Hackatime data for: they have synced
  # Hackatime projects, aren't banned, have finished onboarding (a prerequisite
  # for shipping), and — unless the window is disabled — have been active on the
  # platform recently.
  def engaged_users
    scope = User.joins(:hackatime_projects).distinct
                .where(is_banned: false, onboarding_completed: true)
    if @active_within_days.to_i.positive?
      scope = scope.where("last_active > ?", @active_within_days.to_i.days.ago)
    end
    scope
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

  # Fans the per-user Hackatime fetches out across a bounded thread pool and
  # returns an array of [candidate, projects] pairs (projects may be nil if the
  # fetch failed).
  def fetch_in_parallel(candidates)
    queue = Queue.new
    candidates.each_with_index { |candidate, index| queue << [ index, candidate ] }
    results = Array.new(candidates.size)
    mutex = Mutex.new

    workers = THREADS.times.map do
      Thread.new do
        loop do
          index, candidate = queue.pop(true)
          projects = HackatimeService.fetch_project_details(
            identifier: candidate.identifier,
            access_token: candidate.access_token
          )
          mutex.synchronize { results[index] = [ candidate, projects ] }
        rescue ThreadError
          break # queue is empty
        end
      end
    end
    workers.each(&:join)

    results.compact
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
