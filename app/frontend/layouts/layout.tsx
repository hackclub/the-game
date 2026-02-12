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
        className={`flex min-h-screen overflow-x-hidden antialiased ${className ? className : "bg-[#ededed]"}`}
      >
        <Sidebar />

        <main className="flex-1 px-6 py-10 w-full h-screen overflow-y-scroll -ml-2">{children}</main>
      </div>
    </>
  );
}
