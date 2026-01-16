import Sidebar from "@/components/sidebar";
import { Head } from "@inertiajs/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Hack Club: The Game</title>
    <script async src="https://plausible.io/js/pa-Yp97yeTQ2uEldVj6r5br-.js"></script>
    <script>
      window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
      plausible.init()
    </script>
      </Head>
      <div className="flex min-h-screen bg-gray-200">
        <Sidebar />
        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </div>
    </>
  );
}
