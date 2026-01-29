import { usePage } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";

export default function Home() {
  const { props } = usePage<{ totalProjectTime: number }>();

  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">
        Welcome to the Platform, {props.user.username}!
      </h2>

      <LoggedHours totalProjectTime={props.totalProjectTime} />
    </Layout>
  );
}
