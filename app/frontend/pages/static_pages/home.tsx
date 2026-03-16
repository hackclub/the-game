import { usePage, Link } from "@inertiajs/react";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";
import Announcements from "@/components/home/Announcements";
import { Announcement } from "@/interfaces/announcement";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import iconTransparentHome from "@/assets/icons/icon_transparent_home.svg";
import blankTicket from "@/assets/icons/blank_ticket.svg";
import iconTransparent from "@/assets/icons/icon_transparent.svg";
import OnboardingForced from "@/pages/onboarding-forced";

export default function Home() {
  const { props } = usePage<{
    totalProjectTime: number;
    inProgressTime: number;
    reviewTime: number;
    projectCount: number;
    announcements: Announcement[];
    referralProgram: {
      homepage_alert_title: string;
      homepage_alert_description: string;
    } | null;
  }>();

  if (!props.user?.onboarding_completed && !props.user?.hackatime_id) {
    return <OnboardingForced />;
  }

  const isOnboarding = props.projectCount === 0;

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

        {props.referralProgram && (
          <Link
            href="/invite"
            className="flex items-center justify-between rounded-2xl bg-[#fecb0d] p-6 transition-transform hover:scale-[1.01]"
          >
            <div>
              <p className="smoothing-black text-2xl font-bold tracking-[-0.02em]">
                {props.referralProgram.homepage_alert_title}
              </p>
              <p className="smoothing-black text-lg">
                {props.referralProgram.homepage_alert_description}
              </p>
            </div>
            <span className="smoothing-black text-xl font-bold">→</span>
          </Link>
        )}

        {isOnboarding ? null : (
          <>
            <MissingAccountFields />

            <LoggedHours
              totalProjectTime={props.totalProjectTime}
              inProgressTime={props.inProgressTime}
              reviewTime={props.reviewTime}
              tickets={props.user.balance}
            />

            <IdvVerificationAlert />

            <Announcements announcements={props.announcements} />
          </>
        )}
      </div>
    </Layout>
  );
}
