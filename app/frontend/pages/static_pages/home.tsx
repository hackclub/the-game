import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import Layout from "@/layouts/layout";
import LoggedHours from "@/components/home/LoggedHours";
import Announcements from "@/components/home/Announcements";
import { Announcement } from "@/interfaces/announcement";
import { Goal } from "@/interfaces/goal";
import type { Project } from "@/interfaces/project";
import ProjectCard from "@/components/projects/ProjectCard";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import iconTransparent from "@/assets/icons/icon_transparent.svg";
import OnboardingForced from "@/pages/onboarding-forced";

const ROTATION_SIZE = 3;
const ROTATION_INTERVAL_MS = 5000;

export default function Home() {
  const { props } = usePage<{
    totalProjectTime: number;
    inProgressTime: number;
    reviewTime: number;
    projectCount: number;
    announcements: Announcement[];
    goals: Goal[];
    daysUntilEnd: number;
    boughtInvite: boolean;
    goldenTicketProjects: (Project & { username?: string })[];
  }>();

  const [rotationStart, setRotationStart] = useState(0);
  const goldenTicketProjects = props.goldenTicketProjects ?? [];

  useEffect(() => {
    if (goldenTicketProjects.length <= ROTATION_SIZE) return;

    const interval = setInterval(() => {
      setRotationStart(
        (start) => (start + ROTATION_SIZE) % goldenTicketProjects.length,
      );
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [goldenTicketProjects.length]);

  const visibleGoldenTicketProjects = Array.from(
    { length: Math.min(ROTATION_SIZE, goldenTicketProjects.length) },
    (_, i) =>
      goldenTicketProjects[(rotationStart + i) % goldenTicketProjects.length],
  );

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
            The game is over, but you can still create projects! We're adding
            new shop items every day until we end{" "}
            <span className="font-bold">
              in {props.daysUntilEnd} day{props.daysUntilEnd === 1 ? "" : "s"}
            </span>
            !
          </p>
        </div>

        {visibleGoldenTicketProjects.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="smoothing-black text-3xl font-bold tracking-[-0.02em]">
              During HCTG, awesome projects like these were made:
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {visibleGoldenTicketProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  newTab
                  variant="homepage"
                />
              ))}
            </div>
          </div>
        )}

        {isOnboarding ? null : (
          <>
            <MissingAccountFields />

            <LoggedHours
              totalProjectTime={props.totalProjectTime}
              inProgressTime={props.inProgressTime}
              reviewTime={props.reviewTime}
              tickets={props.user.balance}
              boughtInvite={props.boughtInvite}
              goals={props.goals}
            />

            <IdvVerificationAlert />

            <Announcements announcements={props.announcements} />
          </>
        )}
      </div>
    </Layout>
  );
}
