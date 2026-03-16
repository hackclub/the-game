import { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";
import Layout from "@/layouts/layout";

interface AdminItem {
  id: number;
  name: string;
}

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
  referred_item_id: number | null;
  og_description_template: string | null;
}

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string;
  referral_count: number;
  verified_count: number;
  total_raffle_entries: number;
}

interface Stats {
  total_referrals: number;
  verified_referrals: number;
  total_raffle_entries: number;
}

interface Props {
  program: Program;
  items: AdminItem[];
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}

function RaffleSection({
  leaderboard,
  stats,
}: {
  leaderboard: LeaderboardEntry[];
  stats: Stats;
}) {
  const [rolling, setRolling] = useState(false);

  const participants = useMemo(() => {
    return leaderboard
      .filter((e) => e.total_raffle_entries > 0)
      .map((e) => ({
        ...e,
        chance:
          stats.total_raffle_entries > 0
            ? (e.total_raffle_entries / stats.total_raffle_entries) * 100
            : 0,
      }));
  }, [leaderboard, stats.total_raffle_entries]);

  const rollRaffle = () => {
    setRolling(true);
    router.post("/admin/referrals/roll_raffle", {}, {
      onFinish: () => setRolling(false),
    });
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎲 Raffle Roller</h2>
        <button
          onClick={rollRaffle}
          disabled={rolling || participants.length === 0}
          className="cursor-pointer rounded-lg bg-purple-600 px-6 py-2 font-bold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {rolling ? "Rolling..." : "Roll Raffle"}
        </button>
      </div>

      {participants.length === 0 ? (
        <p className="text-gray-400">No users with raffle entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-right">Entries</th>
                <th className="px-3 py-2 text-right">Chance</th>
                <th className="px-3 py-2 text-left">Probability</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {p.avatar ? (
                        <img
                          src={p.avatar}
                          alt=""
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                          {p.username?.charAt(0) || "?"}
                        </div>
                      )}
                      <span>{p.username || "Anonymous"}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-bold">
                    {p.total_raffle_entries}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {p.chance.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${Math.max(p.chance, 1)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-gray-500">
            {participants.length} participant{participants.length !== 1 && "s"} •{" "}
            {stats.total_raffle_entries} total entries
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminReferrals({
  program,
  items,
  leaderboard,
  stats,
}: Props) {
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
    referred_item_id: program.referred_item_id || "",
    og_description_template: program.og_description_template || "",
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
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-3xl font-bold">{stats.verified_referrals}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Raffle Entries</p>
            <p className="text-3xl font-bold">{stats.total_raffle_entries}</p>
          </div>
        </div>

        {/* Raffle Roller */}
        <RaffleSection leaderboard={leaderboard} stats={stats} />

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

          <h3 className="mt-6 mb-2 text-lg font-bold">
            Referred User Reward
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold">
                Free Item for Referred Users
              </label>
              <select
                value={form.referred_item_id}
                onChange={(e) =>
                  updateField(
                    "referred_item_id",
                    e.target.value === "" ? "" : parseInt(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">None</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                OG Description Template
              </label>
              <input
                type="text"
                value={form.og_description_template}
                onChange={(e) =>
                  updateField("og_description_template", e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2"
                placeholder="<USER> invited you to Hack Club: The Game!"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use &lt;USER&gt; as a placeholder for the referrer's name
              </p>
            </div>
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
                <th className="px-3 py-2 text-right">Verified</th>
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
                      {entry.verified_count}
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
