import { usePage } from "@inertiajs/react";
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
    <Layout className="bg-blue-200">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-5 rounded-md border border-black bg-gray-50 p-10">
          <div>
            <h2 className="mb-2 text-4xl font-bold">
              Welcome to the Platform!
            </h2>
            <p className="text-center text-lg italic">{chosenFlavorText}</p>
          </div>

          <LoggedHours totalProjectTime={props.totalProjectTime} />
        </div>
      </div>
    </Layout>
  );
}
