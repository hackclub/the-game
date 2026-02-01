import { usePage, Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";

const flavorTexts = [
  "Choo Choo Chew!",
  "The Snack Zone awaits...",
  "Manhattan speedrun any%",
  "It seemed closer on the map...",
  "WE GOTTA GO GO GO",
  "the trains are alive",
  "club the game hack",
  "Listen to the pigeons",
  "Don't get distracted by the pizza",
];

const chosenFlavorText =
  flavorTexts[Math.floor(Math.random() * flavorTexts.length)];

export default function Home() {
  const { props } = usePage<{ totalProjectTime: number }>();

  return (
    <Layout className="relative bg-[url(/nyc.png)] bg-cover">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-5 rounded-md border border-black bg-gray-800 py-10 text-white md:px-10">
          <div>
            <h2 className="mb-2 text-center text-4xl font-bold">
              Welcome to the Platform!
            </h2>
            <p className="text-center text-lg italic">{chosenFlavorText}</p>
          </div>

          {!props.user?.hackatime_id && (
            <p className="rounded-md border border-black bg-red-700 p-3 text-lg text-white">
              Your Hackatime account is not linked, and we cannot track your
              time.{" "}
              <Link className="underline" href="/hackatime/link">
                Click here to link.
              </Link>
            </p>
          )}

          {props.totalProjectTime === 0 && (
            <p className="rounded-md border border-black bg-red-700 p-3 text-lg text-white">
              Head over to the{" "}
              <a className="underline" href="/projects">
                projects page
              </a>{" "}
              to create your first project!
            </p>
          )}

          <LoggedHours totalProjectTime={props.totalProjectTime} />
        </div>
      </div>

      <p className="absolute right-0 bottom-0 bg-[#333333DF] px-5 py-1 text-white">
        <a
          href="https://cannoneyed.com/isometric-nyc/"
          className="underline"
          target="_blank"
        >
          Isometric NYC
        </a>{" "}
        by{" "}
        <a href="https://cannoneyed.com/" className="underline" target="_blank">
          Andy Coenen
        </a>
      </p>
    </Layout>
  );
}
