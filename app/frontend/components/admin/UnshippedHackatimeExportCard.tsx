import { useCallback, useEffect, useState } from "react";

interface ExportState {
  status: "idle" | "pending" | "running" | "completed" | "failed";
  total: number | null;
  processed: number;
  rows_count: number | null;
  error: string | null;
  has_file: boolean;
  requested_by: string | null;
  started_at: string | null;
  finished_at: string | null;
}

const POLL_MS = 1500;

function csrfToken() {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? ""
  );
}

function formatTime(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString();
}

export default function UnshippedHackatimeExportCard() {
  const [state, setState] = useState<ExportState | null>(null);
  const [starting, setStarting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/admin/users/unshipped_hackatime/status", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) setState(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const running = state?.status === "pending" || state?.status === "running";

  // Poll while a run is in flight.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(id);
  }, [running, load]);

  const start = useCallback(async () => {
    setStarting(true);
    try {
      const res = await fetch("/admin/users/unshipped_hackatime/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken(),
          Accept: "application/json",
        },
      });
      if (res.ok) setState(await res.json());
    } finally {
      setStarting(false);
    }
  }, []);

  const percent =
    state && state.total && state.total > 0
      ? Math.min(100, Math.round((state.processed / state.total) * 100))
      : 0;

  const status = state?.status ?? "idle";

  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            Unshipped Hackatime CSV
          </span>
          <span className="text-xs text-gray-500">
            Users with 30+ min of unshipped Hackatime time, one project each
          </span>
        </div>

        {!running && (
          <button
            onClick={start}
            disabled={starting}
            className="shrink-0 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "completed" || status === "failed"
              ? "Regenerate"
              : "Generate CSV"}
          </button>
        )}
      </div>

      {running && (
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 tabular-nums">
            {status === "pending"
              ? "Queued…"
              : state?.total
                ? `Fetching Hackatime data — ${state.processed}/${state.total} users (${percent}%)`
                : "Starting…"}
          </span>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            {state?.rows_count ?? 0} users
            {state?.finished_at
              ? ` · generated ${formatTime(state.finished_at)}`
              : ""}
          </span>
          {state?.has_file && (
            <a
              href="/admin/users/unshipped_hackatime/csv"
              className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Download CSV
            </a>
          )}
        </div>
      )}

      {status === "failed" && (
        <span className="text-xs text-red-600">
          Export failed{state?.error ? `: ${state.error}` : ""}
        </span>
      )}
    </div>
  );
}
