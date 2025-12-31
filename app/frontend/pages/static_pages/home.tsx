import { Link } from "@inertiajs/react";
import Sidebar from "@/components/sidebar";

export default function Home({
  account_linked,
  hackatime_linked,
  current_user
}: {
  account_linked: boolean;
  hackatime_linked: boolean;
  current_user: any;
}) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <p className="text-2xl font-bold">hey {current_user.username}!</p>
        <p className="text-xl">welcome home</p>
        
        <hr />
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
        
        <hr />
      
      
        
      </main>
    </div>
  );
}
