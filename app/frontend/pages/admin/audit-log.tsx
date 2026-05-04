import Layout from "@/layouts/layout";
import { Pagination } from "@/interfaces/pagination";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

interface AuditUser {
  id: number;
  username: string;
  avatar: string | null;
}

interface AuditEntry {
  id: number;
  item_type: string;
  item_id: number;
  event: string;
  whodunnit: string | null;
  whodunnit_user: AuditUser | null;
  object_changes: Record<string, [unknown, unknown]> | null;
  created_at: string;
}

interface Props {
  entries: AuditEntry[];
  item_types: string[];
  item_type: string;
  event: string;
  whodunnit: string;
  whodunnit_user: AuditUser | null;
  date_from: string;
  date_to: string;
  pagination: Pagination;
}

// ---- Icons ----------------------------------------------------------------

function IconCreate() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconUpdate() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function IconDestroy() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EventBadge({ event }: { event: string }) {
  const configs: Record<
    string,
    { icon: React.ReactNode; bg: string; text: string; label: string }
  > = {
    create: {
      icon: <IconCreate />,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Created",
    },
    update: {
      icon: <IconUpdate />,
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Updated",
    },
    destroy: {
      icon: <IconDestroy />,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Deleted",
    },
  };
  const cfg = configs[event] ?? {
    icon: null,
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: event,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ---- Diff -----------------------------------------------------------------

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "null";
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
}

function ChangeDiff({
  changes,
}: {
  changes: Record<string, [unknown, unknown]>;
}) {
  // Skip internal timestamps and papertrail noise
  const SKIP = new Set(["updated_at", "created_at"]);
  const entries = Object.entries(changes).filter(([k]) => !SKIP.has(k));

  if (entries.length === 0) {
    return (
      <p className="text-xs text-gray-500 italic">
        No significant changes recorded.
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-2 font-mono text-xs">
      {entries.map(([field, [oldVal, newVal]]) => (
        <div
          key={field}
          className="overflow-hidden rounded border border-gray-200 bg-white"
        >
          <div className="bg-gray-50 px-3 py-1 font-semibold text-gray-600">
            {field}
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div className="bg-red-50 px-3 py-2">
              <span className="mb-1 block text-[10px] tracking-wide text-red-400 uppercase">
                Before
              </span>
              <pre className="break-all whitespace-pre-wrap text-red-700">
                {formatValue(oldVal)}
              </pre>
            </div>
            <div className="bg-green-50 px-3 py-2">
              <span className="mb-1 block text-[10px] tracking-wide text-green-400 uppercase">
                After
              </span>
              <pre className="break-all whitespace-pre-wrap text-green-700">
                {formatValue(newVal)}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- User autocomplete ----------------------------------------------------

interface UserSuggestion {
  id: number;
  username: string;
  avatar: string | null;
}

function UserAutocomplete({
  value,
  selectedUser,
  onChange,
}: {
  value: string;
  selectedUser: AuditUser | null;
  onChange: (id: string, user: UserSuggestion | null) => void;
}) {
  const [query, setQuery] = useState(selectedUser?.username ?? "");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep display query in sync when external value is cleared
  useEffect(() => {
    if (!value) setQuery("");
  }, [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleInput(q: string) {
    setQuery(q);
    // If the user clears the field, clear the filter too
    if (!q) {
      onChange("", null);
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/admin/users/search?q=${encodeURIComponent(q)}`,
          {
            headers: { Accept: "application/json" },
          },
        );
        const data: UserSuggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 200);
  }

  function select(user: UserSuggestion) {
    setQuery(user.username);
    onChange(String(user.id), user);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500">Actor</label>
      <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus-within:ring-2 focus-within:ring-yellow-400">
        {value && selectedUser?.avatar && (
          <img
            src={selectedUser.avatar}
            alt=""
            className="h-5 w-5 shrink-0 rounded-full"
          />
        )}
        <input
          type="text"
          placeholder="Search by username..."
          className="min-w-0 flex-1 border-0 bg-transparent p-0 outline-none"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {value && (
          <button
            type="button"
            className="shrink-0 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setQuery("");
              onChange("", null);
              setSuggestions([]);
              setOpen(false);
            }}
          >
            ×
          </button>
        )}
      </div>
      {open && (
        <ul className="absolute top-full left-0 z-50 mt-1 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-yellow-50"
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(u);
                }}
              >
                <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="truncate">{u.username}</span>
                <span className="ml-auto text-xs text-gray-400">#{u.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Entry row ------------------------------------------------------------

function AuditRow({ entry }: { entry: AuditEntry }) {
  const [open, setOpen] = useState(false);

  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const actor = entry.whodunnit_user;
  const actorName =
    actor?.username ??
    (entry.whodunnit ? `User #${entry.whodunnit}` : "System");

  const itemLabel = entry.item_type.replace("::", " › ");

  return (
    <div
      className={`rounded-lg border bg-white transition-shadow ${open ? "shadow-md" : "shadow-sm hover:shadow-md"}`}
    >
      {/* Main row — always visible */}
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Avatar */}
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {actor?.avatar ? (
            <img
              src={actor.avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
              {actorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Event badge */}
        <EventBadge event={entry.event} />

        {/* Description */}
        <span className="flex-1 truncate text-sm text-gray-800">
          <span className="font-semibold">{actorName}</span>{" "}
          <span className="text-gray-500">
            {entry.event === "create"
              ? "created"
              : entry.event === "update"
                ? "updated"
                : "deleted"}{" "}
          </span>
          <span className="font-mono text-xs font-medium text-gray-700">
            {itemLabel} #{entry.item_id}
          </span>
        </span>

        {/* Date */}
        <span
          className="shrink-0 text-xs text-gray-400"
          title={`${dateStr} ${timeStr}`}
        >
          {dateStr} · {timeStr}
        </span>

        {/* Chevron */}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-gray-100 px-4 pt-3 pb-4">
          <div className="mb-2 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              <span className="font-semibold text-gray-700">Version ID:</span>{" "}
              {entry.id}
            </span>
            <span>
              <span className="font-semibold text-gray-700">Item type:</span>{" "}
              {entry.item_type}
            </span>
            <span>
              <span className="font-semibold text-gray-700">Item ID:</span>{" "}
              {entry.item_id}
            </span>
            {entry.whodunnit && (
              <a
                href={`/users/${entry.whodunnit}`}
                className="font-semibold text-blue-500 underline"
                onClick={(e) => e.stopPropagation()}
              >
                View actor profile →
              </a>
            )}
          </div>

          {entry.object_changes &&
          Object.keys(entry.object_changes).length > 0 ? (
            <ChangeDiff changes={entry.object_changes} />
          ) : (
            <p className="text-xs text-gray-400 italic">
              No change data recorded for this event.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Page -----------------------------------------------------------------

export default function AuditLog({
  entries,
  item_types,
  item_type,
  event,
  whodunnit,
  whodunnit_user,
  date_from,
  date_to,
  pagination,
}: Props) {
  const [filters, setFilters] = useState({
    item_type: item_type || "",
    event: event || "",
    whodunnit: whodunnit || "",
    date_from: date_from || "",
    date_to: date_to || "",
  });
  const [selectedActor, setSelectedActor] = useState<AuditUser | null>(
    whodunnit_user ?? null,
  );

  function set(key: keyof typeof filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function apply() {
    router.get("/admin/audit-log", filters, { preserveScroll: true });
  }

  function reset() {
    const cleared = {
      item_type: "",
      event: "",
      whodunnit: "",
      date_from: "",
      date_to: "",
    };
    setFilters(cleared);
    setSelectedActor(null);
    router.get("/admin/audit-log", cleared, { preserveScroll: true });
  }

  function goToPage(page: number) {
    router.get(
      "/admin/audit-log",
      { ...filters, page },
      { preserveScroll: true },
    );
  }

  const inputCls =
    "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400";

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-3xl font-bold">Audit Log</h1>
        <p className="mb-6 text-sm text-gray-500">
          {pagination.total_count.toLocaleString()} records total
        </p>

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {/* Model type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Model</label>
            <select
              className={inputCls}
              value={filters.item_type}
              onChange={(e) => set("item_type", e.target.value)}
            >
              <option value="">All models</option>
              {item_types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Actor */}
          <UserAutocomplete
            value={filters.whodunnit}
            selectedUser={selectedActor}
            onChange={(id, user) => {
              set("whodunnit", id);
              setSelectedActor(user);
            }}
          />

          {/* Date from */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">From</label>
            <input
              type="date"
              className={inputCls}
              value={filters.date_from}
              onChange={(e) => set("date_from", e.target.value)}
            />
          </div>

          {/* Date to */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">To</label>
            <input
              type="date"
              className={inputCls}
              value={filters.date_to}
              onChange={(e) => set("date_to", e.target.value)}
            />
          </div>

          {/* Event */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Event</label>
            <div className="flex gap-1.5">
              {["create", "update", "destroy"].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => set("event", filters.event === e ? "" : e)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    filters.event === e
                      ? e === "create"
                        ? "border-green-400 bg-green-100 text-green-700"
                        : e === "update"
                          ? "border-blue-400 bg-blue-100 text-blue-700"
                          : "border-red-400 bg-red-100 text-red-700"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {e[0].toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={apply}
              className="cursor-pointer rounded-md bg-[#feca11] px-4 py-1.5 text-sm font-semibold hover:bg-yellow-400"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Log entries */}
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
            No audit log entries match your filters.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <AuditRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <button
              disabled={!pagination.prev_page}
              onClick={() =>
                pagination.prev_page && goToPage(pagination.prev_page)
              }
              className="cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40"
            >
              ← Prev
            </button>
            <span>
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              disabled={!pagination.next_page}
              onClick={() =>
                pagination.next_page && goToPage(pagination.next_page)
              }
              className="cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
