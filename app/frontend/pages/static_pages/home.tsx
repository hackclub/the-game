import { Link } from "@inertiajs/react";
import Sidebar from "@/components/sidebar";
import Countdown from "@/components/home/countdown";
import LoggedHours from "@/components/home/LoggedHours";

export default function Home({
  account_linked,
  hackatime_linked,
  current_user,
  totalProjectTime
}: {
  account_linked: boolean;
  hackatime_linked: boolean;
  current_user: any;
  totalProjectTime: number
}) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <p className="text-2xl font-bold">hey {current_user.username}!</p>
        <p className="text-xl">welcome home</p>
        {/*<Countdown />*/}
        <hr />
        {!account_linked && (
          <>
            <p>yo chat we need to verify your identity</p>
            <p>
              click the lil link below to link with hack club account pls thx
            </p>
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
        <Link href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Go to Admin Dashboard
        </Link>
        </div>
       )}

      </main>
    </div>
  );
}
