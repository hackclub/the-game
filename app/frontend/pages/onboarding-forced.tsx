import { Link, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import iconTransparent from "@/assets/icons/icon_transparent.svg";
import arrowIcon from "@/assets/icons/arrow.svg";

const STEPS = [
  { key: "link_hackatime", label: "Link Hackatime" },
  { key: "go_to_projects", label: "Create a project" },
  { key: "finish", label: "Finish!" },
];

function ProgressCircle({ state }: { state: "done" | "current" | "upcoming" }) {
  return (
    <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center">
      {state === "current" ? (
        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#fecb0d]">
          <div className="h-10 w-10 rounded-full border-4 border-[#fecb0d] bg-white" />
        </div>
      ) : (
        <div
          className={`h-12 w-12 rounded-full ${state === "done" ? "bg-[#fecb0d]" : "bg-[#d9d9d9]"}`}
        />
      )}
    </div>
  );
}

const ALL_STEPS = [{ key: "log_in", label: "Log in" }, ...STEPS];

function ProgressBar({ currentStep }: { currentStep: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const completedCount = currentIndex + 1;
  const progressPercent = (completedCount / STEPS.length) * 100;

  return (
    <div className="relative flex w-full max-w-[700px] items-start justify-between">
      <div className="absolute top-[37px] right-[24px] left-[24px] h-[19px] -translate-y-1/2">
        <div className="h-full w-full bg-[#d9d9d9]" />
        <div
          className="absolute top-0 left-0 h-full bg-[#fecb0d] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {ALL_STEPS.map((step, i) => {
        const stepIndex = i - 1;
        const state: "done" | "current" | "upcoming" =
          i === 0
            ? "done"
            : stepIndex < currentIndex
              ? "done"
              : stepIndex === currentIndex
                ? "current"
                : "upcoming";

        return (
          <div
            key={step.key}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <ProgressCircle state={state} />
            <span
              className={`text-center text-2xl tracking-[-0.04em] ${state === "current" ? "font-bold" : ""}`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Onboarding() {
  const { props } = usePage();

  return (
    <>
      <Head>
        <title>Hack Club: The Game - Onboarding</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center gap-[80px] bg-[#ededed] px-6 py-[120px]">
        <ProgressBar currentStep="link_hackatime" />

        <div className="flex max-w-[1018px] flex-col items-center gap-[45px]">
          <div className="flex items-center gap-6">
            <img
              src={iconTransparent}
              alt=""
              className="h-[62px] w-auto invert"
            />
            <h1 className="text-5xl tracking-[-0.06em]">
              Welcome to <span className="font-bold">Hack Club: The Game!</span>
            </h1>
          </div>

          <div className="text-center text-2xl leading-relaxed tracking-[-0.01em]">
            <p>
              Your goal is to get 40 hours of work on{" "}
              <span className="font-bold">any</span> kind of technical project.
              After that's done, you'll receive an invite to the game!
            </p>
            <br />
            <p>
              In order to track these hours, you'll need to link{" "}
              <span className="font-bold">Hackatime</span> to your Hack Club:
              The Game account! It's our tool to track time in your favorite
              code editors or for hardware projects.
            </p>
          </div>

          <Link
            href="/hackatime/link"
            className="group flex items-center justify-center gap-4 bg-black px-20 py-5 text-2xl font-bold tracking-[-0.01em] text-white transition-colors hover:bg-white hover:text-black"
          >
            <img
              src={arrowIcon}
              alt=""
              className="h-7 w-7 transition-all group-hover:invert"
            />
            Onwards to Hackatime!
          </Link>
        </div>
      </div>
    </>
  );
}
