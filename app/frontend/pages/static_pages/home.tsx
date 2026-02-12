import { usePage, Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";
import { Announcement } from "@/interfaces/announcement";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import iconTransparentHome from "@/assets/figma/icon_transparent_home.svg";
import blankTicket from "@/assets/figma/blank_ticket.svg";
import iconTransparent from "@/assets/figma/icon_transparent.svg";

export default function Home() {
  const { props } = usePage<{
    totalProjectTime: number;
    projectCount: number;
    announcements: Announcement[];
  }>();

  return (
    <Layout>
      <div className="flex flex-col gap-16 px-6 py-8 xl:px-24 xl:py-24">
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline gap-6">
            <img src={iconTransparent} alt="" className="h-16 w-auto invert" />

            <h1 className="smoothing-black text-5xl tracking-[-0.06em]">
              Welcome to <span className="font-bold">Hack Club: The Game!</span>
            </h1>
          </div>

          <p className="smoothing-black text-2xl tracking-[-0.01em]">
            In this stage of the game, everyone{" "}
            <span className="font-bold">creates projects!</span> Your goal is to
            get 40 hours of work on <span className="font-bold">any</span> kind
            of technical project. After that's done, you'll be guaranteed an
            invite to the game!
          </p>
        </div>

        {!props.user?.hackatime_id ? (
          <LinkHackatime />
        ) : props.projectCount === 0 ? (
          <CreateProject />
        ) : (
          <>
            <MissingAccountFields />

            <LoggedHours totalProjectTime={props.totalProjectTime} />

            {props.announcements.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-5xl font-bold tracking-[-0.06em]">
                  Announcements
                </h2>
                <p className="text-2xl text-[#606060]">
                  Click on any of them to read the full thing!
                </p>
                <div className="flex flex-wrap gap-4">
                  {props.announcements.map((announcement) => (
                    <div key={announcement.id} className="w-full sm:w-72">
                      <div className="h-4 rounded-tl-2xl rounded-tr-2xl bg-black" />
                      <div className="rounded-br-2xl rounded-bl-2xl border-2 border-t-0 border-black bg-white p-4">
                        <p className="mb-2 font-bold">{announcement.title}</p>
                        <p className="text-sm">{announcement.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Link
        href="/projects/new"
        className="group fixed right-0 -bottom-12 z-10 origin-left scale-95 rotate-[-10deg] transition-all hover:bottom-0 hover:rotate-0 md:right-20 md:-bottom-2 md:scale-120 md:hover:bottom-8"
      >
        <div className="relative h-[228px] w-[203px]">
          <img
            src={blankTicket}
            alt=""
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 flex flex-col gap-1 px-6 pt-6 pb-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black">
              <img
                src={iconTransparent}
                alt=""
                className="h-7 w-6 object-contain"
              />
            </div>

            <h3 className="smoothing-black m-0 text-2xl leading-tight font-bold">
              Free Stickers
            </h3>

            <p className="smoothing-black text-sm leading-tight">
              Code your first hour, and we'll ship you stickers - free of
              charge!
            </p>
          </div>
        </div>
      </Link>
    </Layout>
  );
}

function LinkHackatime() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl tracking-[-0.01em]">
        Before we get started, you'll need to link your Hackatime account.
      </p>
      <p className="text-2xl tracking-[-0.01em]">
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
        className="self-start rounded-md bg-black px-5 py-3 font-bold tracking-tight text-white"
        href="/hackatime/link"
      >
        Setup Hackatime
      </Link>
    </div>
  );
}

function CreateProject() {
  return (
    <div className="flex w-full justify-center border border-dashed border-[#c2c2c2] bg-[#d9d9d9] px-4 py-16 md:px-16">
      <div className="flex max-w-3xl flex-col gap-4 text-center">
        <h1 className="smoothing-black m-0 text-4xl font-bold">Next steps</h1>

        <p className="smoothing-black text-2xl tracking-[-0.01em]">
          You've successfully linked your Hackatime account! Now, get started by
          creating your first project.
        </p>

        <Link
          className="smoothing-white hover:smoothing-white w-full self-start bg-black px-5 py-3 text-center text-xl font-bold tracking-tight text-white transition-colors hover:bg-white hover:text-black"
          href="/projects/new"
        >
          Create project
        </Link>
      </div>
    </div>
  );
}
