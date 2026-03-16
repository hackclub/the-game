import { useState } from "react";
import Layout from "@/layouts/layout";

interface Referral {
  id: number;
  code: string;
  raffle_entries: number;
  shipped: boolean;
  created_at: string;
  referred_user: {
    id: number;
    avatar: string;
    username: string;
  };
}

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string;
  referral_count: number;
  shipped_count: number;
  total_entries: number;
}

interface Program {
  id: number;
  active: boolean;
  referrer_raffle_entries: number;
  referred_raffle_entries: number;
  raffle_title: string;
  raffle_description: string;
  raffle_image_url: string | null;
  homepage_alert_title: string;
  homepage_alert_description: string;
  invite_page_description: string;
}

interface Props {
  referral_code: string;
  referral_link: string;
  referrals: Referral[];
  leaderboard: LeaderboardEntry[];
  program: Program;
  stats: {
    total_referrals: number;
    shipped_referrals: number;
    total_raffle_entries: number;
  };
}

export default function InvitePage({
  referral_code,
  referral_link,
  referrals,
  leaderboard,
  program,
  stats,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(referral_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-10 px-6 py-8 xl:px-24 xl:py-16">
        <div>
          <h1 className="smoothing-black text-5xl font-bold tracking-[-0.04em]">
            Invite Friends
          </h1>
          <p className="smoothing-black mt-2 text-xl tracking-[-0.01em]">
            {program.invite_page_description}
          </p>
        </div>

        {/* Raffle Info */}
        <div className="flex items-center gap-6 rounded-2xl border-2 border-black bg-white p-6">
          {program.raffle_image_url && (
            <img
              src={program.raffle_image_url}
              alt={program.raffle_title}
              className="h-24 w-24 shrink-0 rounded-xl object-cover"
            />
          )}
          <div>
            <h2 className="smoothing-black text-2xl font-bold">
              🎟️ {program.raffle_title}
            </h2>
            <p className="smoothing-black mt-1 text-lg text-gray-700">
              {program.raffle_description}
            </p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="rounded-2xl bg-[#fecb0d] p-6">
          <h2 className="smoothing-black mb-3 text-2xl font-bold">
            Your Invite Link
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={referral_link}
              className="flex-1 rounded-xl border-2 border-black bg-white px-4 py-3 font-mono text-lg"
            />
            <button
              onClick={copyLink}
              className="smoothing-black cursor-pointer rounded-xl border-2 border-black bg-black px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-black bg-white p-6">
            <p className="smoothing-black text-lg">Total Referrals</p>
            <p className="smoothing-black text-4xl font-bold">
              {stats.total_referrals}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-black bg-white p-6">
            <p className="smoothing-black text-lg">Shipped</p>
            <p className="smoothing-black text-4xl font-bold">
              {stats.shipped_referrals}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-black bg-white p-6">
            <div className="flex items-center gap-2">
              <p className="smoothing-black text-lg">Raffle Entries</p>
              <span>🎟️</span>
            </div>
            <p className="smoothing-black text-4xl font-bold">
              {stats.total_raffle_entries}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="smoothing-black mb-4 text-3xl font-bold tracking-[-0.02em]">
            Leaderboard
          </h2>
          <div className="overflow-hidden rounded-2xl border-2 border-black">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-right">Referrals</th>
                  <th className="px-4 py-3 text-right">Shipped</th>
                  <th className="px-4 py-3 text-right">Entries</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No referrals yet. Be the first!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-bold">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt=""
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
                              {entry.username?.charAt(0) || "?"}
                            </div>
                          )}
                          <span className="font-bold">
                            {entry.username || "Anonymous"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {entry.referral_count}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {entry.shipped_count}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {entry.total_entries}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Referrals */}
        <div>
          <h2 className="smoothing-black mb-4 text-3xl font-bold tracking-[-0.02em]">
            Your Referrals
          </h2>
          {referrals.length === 0 ? (
            <p className="text-lg text-gray-500">
              You haven't referred anyone yet. Share your link to get started!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between rounded-xl border-2 border-black bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    {referral.referred_user.avatar ? (
                      <img
                        src={referral.referred_user.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold">
                        {referral.referred_user.username?.charAt(0) || "?"}
                      </div>
                    )}
                    <div>
                      <p className="font-bold">
                        {referral.referred_user.username || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Joined{" "}
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {referral.shipped ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
                        Shipped
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-600">
                        Pending
                      </span>
                    )}
                    {referral.raffle_entries > 0 && (
                      <div className="flex items-center gap-1">
                        <span>🎟️</span>
                        <span className="font-bold">
                          +{referral.raffle_entries}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
