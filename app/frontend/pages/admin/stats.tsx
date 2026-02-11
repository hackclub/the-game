import Layout from "@/layouts/layout";
import type { Statistic } from "@/interfaces/statistic";
import { FunnelChart, Funnel, Tooltip, LabelList } from "recharts";

export default function Stats({ stats }: { stats: Statistic }) {
  const data = [
    { name: "All users", value: stats.user_count, fill: "#8884d8" },
    { name: "HCA linked", value: stats.user_account_count, fill: "#83a6ed" },
    {
      name: "Hackatime linked",
      value: stats.user_hackatime_count,
      fill: "#8dd1e1",
    },
    {
      name: "Project created",
      value: stats.user_project_created_count,
      fill: "#82ca9d",
    },
    {
      name: "Project shipped",
      value: stats.user_project_shipped_count,
      fill: "#a4de6c",
    },
  ];
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stats</h1>
        <p className="italic">As of {new Date(stats.date).toLocaleString()}</p>
      </div>
      <p>
        <span className="font-bold"># of approved hours:</span>{" "}
        {stats.approved_hours}
      </p>
      <p>
        <span className="font-bold"># of projects:</span> {stats.project_count}
      </p>
      <p className="my-5 font-bold">User funnel</p>
      <FunnelChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        margin={{
          right: 30,
        }}
      >
        <Tooltip />
        <Funnel dataKey="value" data={data}>
          <LabelList
            position="center"
            fill="#000"
            stroke="none"
            dataKey="name"
          />
        </Funnel>
      </FunnelChart>
    </Layout>
  );
}
