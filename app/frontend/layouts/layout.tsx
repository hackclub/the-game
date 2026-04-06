import Sidebar from "@/components/sidebar";
import TutorialOverlay from "@/components/onboarding/TutorialOverlay";
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

        <main className="relative -ml-2 h-screen w-full flex-1 overflow-y-scroll px-6 py-10">
          {children}
        </main>

        <TutorialOverlay />
      </div>
    </>
  );
}
