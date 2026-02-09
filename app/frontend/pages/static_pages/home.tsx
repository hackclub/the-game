import { usePage, Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";
import { Announcement } from "@/interfaces/announcement";
import MissingAccountFields from "@/components/settings/missingAccountFields";

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
  const { props } = usePage<{
    totalProjectTime: number;
    projectCount: number;
    announcements: Announcement[];
  }>();

  return (
    <Layout className="relative bg-[url(/nyc.png)] bg-cover">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        {props.announcements.map((announcement) => (
          <div className="w-2/3 rounded-md border-4 border-yellow-500 bg-gray-700 p-4 text-center text-lg text-white md:w-1/3">
            <p className="font-bold">{announcement.title}</p>
            <p>{announcement.content}</p>
          </div>
        ))}
        <div className="flex w-full flex-col items-center gap-5 rounded-md border border-black bg-gray-800 py-10 text-white md:max-w-1/2 md:px-10">
          {!props.user?.hackatime_id ? (
            <LinkHackatime />
          ) : props.projectCount === 0 ? (
            <CreateProject />
          ) : (
            <>
              <div>
                <h2 className="mb-2 text-center text-4xl font-bold">
                  Welcome to the Platform!
                </h2>
                <p className="text-center text-lg italic">{chosenFlavorText}</p>
              </div>

              <MissingAccountFields />

              <LoggedHours totalProjectTime={props.totalProjectTime} />
            </>
          )}
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

function LinkHackatime() {
  return (
    <div className="flex flex-col gap-2 px-5 text-white md:text-lg">
      <p>
        <span className="font-bold">Welcome to Hack Club: The Game!</span>
        <br />
        Before we get started, you'll need to link your Hackatime account.
      </p>
      <p>
        <span className="italic">What's Hackatime?</span>
        <br />
        Hackatime is how we track how long you've been coding! You can use it
        with any coding editor, and even use{" "}
        <a href="https://lapse.hackclub.com" className="underline">
          Lapse
        </a>{" "}
        for editors or real-life projects that aren't automatically supported.
      </p>
      <Link
        className="self-center rounded-md bg-blue-600 px-5 py-3"
        href="/hackatime/link"
      >
        Setup Hackatime
      </Link>
    </div>
  );
}

function CreateProject() {
  return (
    <div className="flex flex-col gap-2 px-5 text-white md:text-lg">
      <p>
        <span className="font-bold">Welcome to Hack Club: The Game!</span>
        <br />
        You're all set up! Get started by creating your first project.
      </p>
      <Link
        className="self-center rounded-md bg-blue-600 px-5 py-3"
        href="/projects/new"
      >
        Create project
      </Link>
    </div>
  );
}
