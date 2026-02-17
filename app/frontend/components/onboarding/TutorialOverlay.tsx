import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import clsx from "clsx";
interface TutorialStep {
  id: string;
  stepNumber: number | null;
  dialogue: React.ReactNode;
  modality: "ALWAYS" | "DISMISSABLE" | "CLOSABLE";
  arrow: {
    pointAt: string;
    angle: number;
  } | null;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "go_to_projects",
    stepNumber: 1,
    dialogue: (
      <>
        Welcome! Let's lay out the blueprint for your first project. Click on
        the <strong>Projects</strong> tab!
      </>
    ),
    arrow: {
      pointAt: '[href="/projects"]',
      angle: 0,
    },
    modality: "ALWAYS",
  },
  {
    id: "click_on_create",
    stepNumber: 2,
    dialogue: (
      <>
        Nice! Now, click on <strong>Create new project</strong> to outline what
        you'll be working on for Hack Club: The Game!
      </>
    ),
    arrow: {
      pointAt: '[href="/projects/new"]',
      angle: -45,
    },
    modality: "ALWAYS",
  },
  {
    id: "create_project",
    stepNumber: 3,
    dialogue: (
      <>
        Come up with a tech project! No need for a full plan - this is just the
        first milestone of many to come.
      </>
    ),
    arrow: null,
    modality: "DISMISSABLE",
  },
  {
    id: "finish",
    stepNumber: null,
    dialogue: (
      <>
        Yay! Now you can track time on your project with Hackatime. Have fun,
        and come back when your project is ready!
      </>
    ),
    arrow: null,
    modality: "CLOSABLE",
  },
];

function inferStep(
  url: string,
  hasHackatime: boolean,
  projectCount: number,
): TutorialStep | null {
  if (!hasHackatime) return null;

  if (projectCount === 0) {
    if (url.startsWith("/projects/new")) return TUTORIAL_STEPS[2];
    if (url.startsWith("/projects")) return TUTORIAL_STEPS[1];
    return TUTORIAL_STEPS[0];
  }

  return TUTORIAL_STEPS[3];
}

function ArrowPointer({
  targetSelector,
  angle,
}: {
  targetSelector: string;
  angle: number;
}) {
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const arrowRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const target = document.querySelector(targetSelector);
    if (!target || !arrowRef.current) return;

    const targetRect = target.getBoundingClientRect();
    const parentRect = arrowRef.current.offsetParent?.getBoundingClientRect();
    if (!parentRect) return;

    const targetCenterX =
      targetRect.left + targetRect.width / 2 - parentRect.left;
    const targetCenterY =
      targetRect.top + targetRect.height / 2 - parentRect.top;

    setPosition({
      x: targetCenterX + targetRect.width / 4,
      y: targetCenterY - targetRect.height / 2 + 4,
    });
  }, [targetSelector, arrowRef.current]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    const interval = setInterval(updatePosition, 500);
    return () => {
      window.removeEventListener("resize", updatePosition);
      clearInterval(interval);
    };
  }, [updatePosition]);

  return (
    <div
      ref={arrowRef}
      className="pointer-events-none absolute z-[9998] drop-shadow-xl"
      style={{
        left: position?.x,
        top: position?.y,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <img
        src="/images/onboarding/arrow.svg"
        alt=""
        className="animate-move-right h-[60px] w-auto"
      />
    </div>
  );
}

export default function TutorialOverlay() {
  const { props, url } = usePage();
  const [dismissed, setDismissed] = useState(false);

  const onboardingCompleted = props.user?.onboarding_completed;
  const hasHackatime = !!props.user?.hackatime_id;
  const projectCount = props.user?.project_count ?? 0;

  const step = useMemo(
    () =>
      onboardingCompleted || dismissed
        ? null
        : inferStep(url, hasHackatime, projectCount),
    [url, hasHackatime, projectCount, onboardingCompleted, dismissed],
  );

  if (!step) return null;

  const handleClose = () => {
    setDismissed(true);

    if (step.modality === "CLOSABLE") {
      router.post(
        "/onboarding/complete",
        {},
        { preserveState: true, preserveScroll: true },
      );
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {step.arrow && (
        <ArrowPointer
          targetSelector={step.arrow.pointAt}
          angle={step.arrow.angle}
        />
      )}

      <div
        className={clsx(
          "pointer-events-auto absolute right-[-100px] bottom-[20px] flex items-center p-16 sm:right-[40px] sm:items-end",
          "max-lg:translate-x-8 max-lg:scale-75",
        )}
      >
        <div className="relative">
          <div
            className="relative flex h-[200px] w-[660px] items-center bg-contain bg-no-repeat pb-4"
            style={{
              backgroundImage: `url("/images/onboarding/speech-bubble.svg")`,
              filter: "drop-shadow(16px 16px 0px #000)",
            }}
          >
            <div className="inset-0 flex gap-4 px-10 pr-[120px]">
              {step.stepNumber !== null && (
                <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-black">
                  <span className="text-[32px] leading-none font-bold text-white">
                    {step.stepNumber}
                  </span>
                </div>
              )}
              <p className="text-[26px] leading-snug text-black">
                {step.dialogue}
              </p>
            </div>

            {step.modality != "ALWAYS" && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute -top-[20px] right-[80px] z-10 cursor-pointer"
              >
                <div className="transition-transform hover:scale-110 active:scale-90">
                  <img
                    src="/images/onboarding/close.svg"
                    alt="Close"
                    className="h-[50px] w-[50px]"
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        <img
          src="/images/onboarding/mascot.png"
          alt="Mascot"
          className="mb-[-20px] ml-[-40px] hidden h-[220px] w-auto sm:block"
          style={{ transform: "rotate(-13deg)" }}
        />
      </div>
    </div>
  );
}
