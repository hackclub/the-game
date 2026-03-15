import { useState } from "react";
import { router } from "@inertiajs/react";
import Layout from "@/layouts/layout";

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string;
  referral_count: number;
  shipped_count: number;
  total_tickets: number;
}

interface Program {
  id: number;
  referrer_bonus_percentage: number;
  referred_bonus_tickets: number;
  max_referrers: number;
  rollout_batch_size: number;
  rollout_interval_hours: number;
  rollout_status: string;
  last_rollout_at: string | null;
  rollout_count: number;
  slack_message_template: string;
}

interface Stats {
  total_eligible_users: number;
  total_referrals: number;
  shipped_referrals: number;
  total_tickets_awarded: number;
}

interface Props {
  program: Program;
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}

export default function AdminReferrals({ program, leaderboard, stats }: Props) {
  const [form, setForm] = useState({
    referrer_bonus_percentage: program.referrer_bonus_percentage,
    referred_bonus_tickets: program.referred_bonus_tickets,
    max_referrers: program.max_referrers,
    rollout_batch_size: program.rollout_batch_size,
    rollout_interval_hours: program.rollout_interval_hours,
    slack_message_template: program.slack_message_template || "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    router.patch("/admin/referrals/update_program", {
      referral_program: form,
    });
  };

  const startRollout = () => {
    router.post("/admin/referrals/start_rollout");
  };

  const pauseRollout = () => {
    router.post("/admin/referrals/pause_rollout");
  };

  const statusColor: Record<string, string> = {
    paused: "bg-yellow-100 text-yellow-800",
    running: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <Layout>
      <div className="px-8">
        <h1 className="smoothing-black mb-6 text-4xl font-bold">
          Referral Program
        </h1>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Eligible Users</p>
            <p className="text-3xl font-bold">{stats.total_eligible_users}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Referrals</p>
            <p className="text-3xl font-bold">{stats.total_referrals}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Shipped</p>
            <p className="text-3xl font-bold">{stats.shipped_referrals}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Tickets Awarded</p>
            <p className="text-3xl font-bold">{stats.total_tickets_awarded}</p>
          </div>
        </div>

        {/* Rollout Controls */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Rollout</h2>
          <div className="mb-4 flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${statusColor[program.rollout_status] || "bg-gray-100"}`}
            >
              {program.rollout_status.charAt(0).toUpperCase() +
                program.rollout_status.slice(1)}
            </span>
            <span className="text-gray-600">
              {program.rollout_count} / {program.max_referrers} users rolled out
            </span>
            {program.last_rollout_at && (
              <span className="text-sm text-gray-400">
                Last: {new Date(program.last_rollout_at).toLocaleString()}
              </span>
            )}
          </div>
          <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#fecb0d]"
              style={{
                width: `${Math.min((program.rollout_count / program.max_referrers) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="flex gap-3">
            {program.rollout_status !== "running" && (
              <button
                onClick={startRollout}
                className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
              >
                {program.rollout_status === "completed"
                  ? "Restart Rollout"
                  : "Start Rollout"}
              </button>
            )}
            {program.rollout_status === "running" && (
              <button
                onClick={pauseRollout}
                className="cursor-pointer rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600"
              >
                Pause Rollout
              </button>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Settings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-bold">
                Referrer Bonus (%)
              </label>
              <input
                type="number"
                value={form.referrer_bonus_percentage}
                onChange={(e) =>
                  updateField(
                    "referrer_bonus_percentage",
                    parseInt(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Referred Bonus Tickets
              </label>
              <input
                type="number"
                value={form.referred_bonus_tickets}
                onChange={(e) =>
                  updateField(
                    "referred_bonus_tickets",
                    parseInt(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Max Referrers
              </label>
              <input
                type="number"
                value={form.max_referrers}
                onChange={(e) =>
                  updateField("max_referrers", parseInt(e.target.value))
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Batch Size
              </label>
              <input
                type="number"
                value={form.rollout_batch_size}
                onChange={(e) =>
                  updateField("rollout_batch_size", parseInt(e.target.value))
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Interval (hours)
              </label>
              <input
                type="number"
                value={form.rollout_interval_hours}
                onChange={(e) =>
                  updateField(
                    "rollout_interval_hours",
                    parseInt(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-bold">
              Slack Message Template
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Variables: {"{{user}}"}, {"{{bonus_tickets}}"}, {"{{link}}"},{" "}
              {"{{referrer_percentage}}"}
            </p>
            <textarea
              value={form.slack_message_template}
              onChange={(e) =>
                updateField("slack_message_template", e.target.value)
              }
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <button
            onClick={saveSettings}
            className="mt-4 cursor-pointer rounded-lg bg-black px-6 py-2 font-bold text-white hover:bg-gray-800"
          >
            Save Settings
          </button>
        </div>

        {/* Leaderboard */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-right">Referrals</th>
                <th className="px-3 py-2 text-right">Shipped</th>
                <th className="px-3 py-2 text-right">Tickets</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-gray-400"
                  >
                    No referrals yet
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr key={entry.id} className="border-b">
                    <td className="px-3 py-2 font-bold">{index + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {entry.avatar ? (
                          <img
                            src={entry.avatar}
                            alt=""
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                            {entry.username?.charAt(0) || "?"}
                          </div>
                        )}
                        <span>{entry.username || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {entry.referral_count}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {entry.shipped_count}
                    </td>
                    <td className="px-3 py-2 text-right font-bold">
                      {entry.total_tickets}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
