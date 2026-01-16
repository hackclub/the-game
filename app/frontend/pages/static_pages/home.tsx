import { Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";

export default function Home({
  account_linked,
  hackatime_linked,
  current_user,
  totalProjectTime,
}: {
  account_linked: boolean;
  hackatime_linked: boolean;
  current_user: any;
  totalProjectTime: number;
}) {
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">
        Welcome to the Platform, {current_user.username}!
      </h2>
      {!account_linked && (
        <>
          <p>yo chat we need to verify your identity</p>
          <p>click the lil link below to link with hack club account pls thx</p>
          <a href="/auth/start">link me!</a>
        </>
      )}
      {account_linked && !hackatime_linked && (
        <>
          <p>yo chat we need to link to hackatime</p>
          <p>
            go to <a href="https://hackatime.hackclub.com">hackatime</a> and
            auth with the same slack account
          </p>
        </>
      )}

      <LoggedHours totalProjectTime={totalProjectTime} />

      {current_user.admin && (
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
