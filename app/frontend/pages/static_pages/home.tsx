import { Link, usePage } from "@inertiajs/react";
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

      {props.user.role === "admin" && (
        <div className="mt-6">
          <Link
            href="/admin"
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      )}
    </Layout>
  );
}
