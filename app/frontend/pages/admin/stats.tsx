import Layout from "@/layouts/layout";
import type { Statistic, OrderEntry } from "@/interfaces/statistic";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface StatsProps {
  stats: Statistic;
  invite_purchase_count: number;
  invite_projected_count: number | null;
  orders_over_time: OrderEntry[];
  invite_orders_over_time: OrderEntry[];
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 mb-3 text-xl font-bold">{children}</h2>;
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p>
      <span className="font-bold">{label}:</span> {value}
    </p>
  );
}

export default function Stats({
  stats,
  invite_purchase_count,
  invite_projected_count,
  orders_over_time,
  invite_orders_over_time,
}: StatsProps) {
  const funnelData = [
    { name: "All users", value: stats.user_count, fill: "#6366f1" },
    { name: "HCA linked", value: stats.user_account_count, fill: "#8b5cf6" },
    { name: "Slack linked", value: stats.user_slack_count, fill: "#a78bfa" },
    {
      name: "Hackatime linked",
      value: stats.user_hackatime_count,
      fill: "#60a5fa",
    },
    {
      name: "IDV verified",
      value: stats.user_idv_verified_count,
      fill: "#34d399",
    },
    {
      name: "Onboarding done",
      value: stats.user_onboarding_count,
      fill: "#4ade80",
    },
    {
      name: "Project created",
      value: stats.user_project_created_count,
      fill: "#facc15",
    },
    {
      name: "Project submitted",
      value: stats.user_project_submitted_count,
      fill: "#fb923c",
    },
    {
      name: "Project approved",
      value: stats.user_project_shipped_count,
      fill: "#f87171",
    },
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stats</h1>
        <p className="text-gray-500 italic">
          As of {new Date(stats.date).toLocaleString()}
        </p>
      </div>

      <SectionHeading>Overview</SectionHeading>
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Approved hours", value: stats.approved_hours.toFixed(1) },
          { label: "Total projects", value: stats.project_count },
          { label: "Event invite purchases", value: invite_purchase_count },
          ...(invite_projected_count !== null
            ? [
                {
                  label: "Projected invites by May 22",
                  value: invite_projected_count,
                },
              ]
            : []),
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex min-w-40 flex-col gap-1 rounded-lg border border-gray-200 p-5"
          >
            <span className="text-4xl font-bold tabular-nums">{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      <SectionHeading>User funnel</SectionHeading>
      <div className="flex flex-wrap items-start gap-8">
        <FunnelChart width={700} height={540} margin={{ right: 30 }}>
          <Tooltip />
          <Funnel dataKey="value" data={funnelData}>
            <LabelList
              position="center"
              fill="#000"
              stroke="none"
              dataKey="name"
            />
          </Funnel>
        </FunnelChart>
        <div className="shrink-0 overflow-x-auto">
          <table className="border-collapse text-sm">
            <tbody>
              {funnelData.map((row, i) => {
                const pct =
                  i === 0
                    ? 100
                    : ((row.value / funnelData[0].value) * 100).toFixed(1);
                const prevPct =
                  i === 0
                    ? null
                    : ((row.value / funnelData[i - 1].value) * 100).toFixed(1);
                return (
                  <tr key={row.name} className="border-b border-gray-100">
                    <td className="w-40 py-1 pr-4 font-medium">{row.name}</td>
                    <td className="w-20 py-1 pr-4 text-right tabular-nums">
                      {row.value.toLocaleString()}
                    </td>
                    <td className="w-24 py-1 pr-4 text-gray-500">
                      {pct}% of all
                    </td>
                    {prevPct !== null && (
                      <td className="py-1 text-xs text-gray-400">
                        {prevPct}% of prev
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeading>Event invite orders over time</SectionHeading>
      {invite_orders_over_time.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={invite_orders_over_time}
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              labelFormatter={(v) => formatDate(String(v))}
              formatter={(v) => [v, "Orders"]}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-400">No invite order data.</p>
      )}

      <SectionHeading>Shop orders over time</SectionHeading>
      <p className="mb-3 text-sm text-gray-500">
        Pending and on-hold orders only — fulfilled orders excluded.
      </p>
      {orders_over_time.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={orders_over_time}
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              labelFormatter={(v) => formatDate(String(v))}
              formatter={(v) => [v, "Orders"]}
            />
            <Bar dataKey="count" fill="#f97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-400">No order data.</p>
      )}
    </Layout>
  );
}
