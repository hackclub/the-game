import Sidebar from "@/components/sidebar";
import { Head } from "@inertiajs/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Hack Club: The Game</title>
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </div>
    </>
  );
}
