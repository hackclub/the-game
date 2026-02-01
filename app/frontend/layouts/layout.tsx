import Sidebar from "@/components/sidebar";
import { Head } from "@inertiajs/react";

export default function Layout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Head>
        <title>Hack Club: The Game</title>
      </Head>
      <div
        className={`flex min-h-screen ${className ? className : "bg-gray-50"}`}
      >
        <Sidebar />
        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </div>
    </>
  );
}
