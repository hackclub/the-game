import { useState } from "react";
import { router } from "@inertiajs/react";
import Layout from "@/layouts/layout";

interface Program {
  id: number;
  active: boolean;
  referrer_raffle_entries: number;
  referred_raffle_entries: number;
  raffle_title: string | null;
  raffle_description: string | null;
  raffle_image_url: string | null;
  homepage_alert_title: string | null;
  homepage_alert_description: string | null;
  invite_page_description: string | null;
}

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string;
  referral_count: number;
  shipped_count: number;
  total_raffle_entries: number;
}

interface Stats {
  total_referrals: number;
  shipped_referrals: number;
  total_raffle_entries: number;
}

interface Props {
  program: Program;
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}

export default function AdminReferrals({ program, leaderboard, stats }: Props) {
  const [form, setForm] = useState({
    active: program.active,
    referrer_raffle_entries: program.referrer_raffle_entries,
    referred_raffle_entries: program.referred_raffle_entries,
    raffle_title: program.raffle_title || "",
    raffle_description: program.raffle_description || "",
    raffle_image_url: program.raffle_image_url || "",
    homepage_alert_title: program.homepage_alert_title || "",
    homepage_alert_description: program.homepage_alert_description || "",
    invite_page_description: program.invite_page_description || "",
  });

  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    router.patch("/admin/referrals/update_program", {
      referral_program: form,
    });
  };

  const toggleActive = () => {
    const newActive = !form.active;
    updateField("active", newActive);
    router.patch("/admin/referrals/update_program", {
      referral_program: { active: newActive },
    });
  };

  return (
    <Layout>
      <div className="px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="smoothing-black text-4xl font-bold">
            Referral Program
          </h1>
          <button
            onClick={toggleActive}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              form.active
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {form.active ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Referrals</p>
            <p className="text-3xl font-bold">{stats.total_referrals}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Shipped</p>
            <p className="text-3xl font-bold">{stats.shipped_referrals}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Raffle Entries</p>
            <p className="text-3xl font-bold">{stats.total_raffle_entries}</p>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Settings</h2>
          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm font-bold">Active</label>
            <button
              type="button"
              onClick={() => updateField("active", !form.active)}
              className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                form.active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  form.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold">
                Referrer Raffle Entries
              </label>
              <input
                type="number"
                value={form.referrer_raffle_entries}
                onChange={(e) =>
                  updateField(
                    "referrer_raffle_entries",
                    parseInt(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Referred Raffle Entries
              </label>
              <input
                type="number"
                value={form.referred_raffle_entries}
                onChange={(e) =>
                  updateField(
                    "referred_raffle_entries",
                    parseInt(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Raffle Title
              </label>
              <input
                type="text"
                value={form.raffle_title}
                onChange={(e) => updateField("raffle_title", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Raffle Image URL
              </label>
              <input
                type="text"
                value={form.raffle_image_url}
                onChange={(e) =>
                  updateField("raffle_image_url", e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Homepage Alert Title
              </label>
              <input
                type="text"
                value={form.homepage_alert_title}
                onChange={(e) =>
                  updateField("homepage_alert_title", e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold">
                Raffle Description
              </label>
              <textarea
                value={form.raffle_description}
                onChange={(e) =>
                  updateField("raffle_description", e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Homepage Alert Description
              </label>
              <textarea
                value={form.homepage_alert_description}
                onChange={(e) =>
                  updateField("homepage_alert_description", e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-bold">
              Invite Page Description
            </label>
            <textarea
              value={form.invite_page_description}
              onChange={(e) =>
                updateField("invite_page_description", e.target.value)
              }
              rows={3}
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
                <th className="px-3 py-2 text-right">Entries</th>
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
                      {entry.total_raffle_entries}
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
