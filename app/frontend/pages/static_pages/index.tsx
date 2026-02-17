import { useState, useRef, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import Step from "../../components/rsvp/Step";
import QuestionAnswer from "../../components/rsvp/QuestionAnswer";
import DynamicBackgroundLines from "../../components/rsvp/DynamicBackgroundLines";
import HackClubLogo from "../../components/rsvp/HackClubLogo";
import ArrowVector from "../../components/rsvp/ArrowVector";

import HackClubFooter from "../../components/rsvp/HackClubFooter";
export default function RsvpPage() {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const step1CircleRef = useRef<HTMLDivElement>(null);
  const step2CircleRef = useRef<HTMLDivElement>(null);
  const step3CircleRef = useRef<HTMLDivElement>(null);

  const { props, flash } = usePage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowScrollArrow(scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="hero"
      className="relative flex w-full flex-col items-start bg-white"
    >
      <Head title="Hack Club: The Game" />
      <DynamicBackgroundLines
        stepCircleRefs={[step1CircleRef, step2CircleRef, step3CircleRef]}
      />

      <div className="fixed top-5 right-5 flex flex-col gap-3">
        {Object.entries(flash ?? {}).map(([key, message]) => (
          <div
            x-key={key}
            className={`${key === "alert" ? "bg-red-500" : "bg-green-700"} m-4 rounded-md border-2 border-${key === "alert" ? "red-700" : "green-900"} p-4`}
          >
            <p className="text-lg text-white">{message as string}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12 lg:py-24">
        <div className="flex w-full max-w-none flex-col items-end lg:max-w-6xl">
          <div className="flex w-full flex-col border-t-30 border-r-4 border-b-4 border-l-4 border-solid border-black bg-white lg:flex-row">
            <div className="flex items-center justify-center bg-white px-6 py-6 lg:border-r-0">
              <div className="h-20 w-auto lg:h-24">
                <HackClubLogo className="block h-full w-auto max-w-none" />
              </div>
            </div>

            <div className="flex flex-1 flex-col border-t-4 border-black bg-white px-6 py-6 lg:border-t-0 lg:border-l-4 lg:px-10 lg:py-8">
              <div className="mb-4">
                <p className="smoothing-black text-2xl leading-tight tracking-[-0.05em] whitespace-nowrap sm:text-3xl lg:text-6xl lg:leading-none xl:text-8xl">
                  <span className="font-normal">hack club: </span>
                  <span className="font-bold">the game</span>
                </p>
              </div>
              <div className="smoothing-black space-y-1 text-lg leading-tight tracking-[-0.04em] lg:text-2xl lg:leading-none xl:text-3xl">
                <p>
                  Build projects, then compete in a scavenger hunt adventure
                  game across Manhattan
                </p>
              </div>
            </div>
          </div>

          {props.user ? (
            <a
              href="/home"
              className="mt-1 flex h-full w-full cursor-pointer items-center justify-center gap-3 border-4 border-black bg-white px-4 py-4 transition-colors hover:bg-black hover:text-white lg:gap-4 lg:px-6 lg:py-6"
            >
              <div className="h-6 w-6 lg:h-7 lg:w-7">
                <ArrowVector className="block h-full w-full max-w-none" />
              </div>
              <span className="smoothing-black text-xl font-bold tracking-[-0.05em] lg:text-4xl">
                Enter the Platform
              </span>
            </a>
          ) : (
            <form
              action="/auth/hca"
              className="mt-4 flex h-20 w-full flex-col gap-2 sm:flex-row lg:gap-3"
            >
              <div className="flex h-full border-4 border-black bg-white px-4 sm:flex-1 lg:px-6">
                <input
                  required
                  name="login_hint"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border-none bg-transparent font-[Arial] text-lg tracking-[-0.04em] text-black placeholder-gray-400 outline-none focus:ring-0 lg:text-3xl"
                />
              </div>

              <button
                type="submit"
                className="flex h-full w-full cursor-pointer items-center justify-center gap-3 border-4 border-black bg-white px-4 py-4 transition-colors hover:bg-black hover:text-white sm:w-auto lg:gap-4 lg:px-6 lg:py-6"
              >
                <div className="h-6 w-6 lg:h-7 lg:w-7">
                  <ArrowVector className="block h-full w-full max-w-none" />
                </div>
                <span className="text-xl font-bold tracking-[-0.05em] lg:text-4xl">
                  Get Started
                </span>
              </button>
            </form>
          )}
        </div>

        {showScrollArrow && (
          <a
            href="#steps"
            className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce cursor-pointer flex-col items-center scroll-smooth transition-opacity duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        )}
      </div>

      <div
        className="relative z-10 flex w-full flex-col px-6 pb-24 lg:gap-24 lg:px-48 lg:pb-40"
        id="steps"
      >
        <div className="flex flex-col gap-10">
          <Step
            stepNumber="1"
            title="Build projects"
            circleRef={step1CircleRef}
          >
            <span className="font-normal">
              {" "}
              Work on any programming project you like for{" "}
              <span className="font-bold"> 40 hours</span>, and get tickets for
              every project you ship!{" "}
            </span>{" "}
            That's only <span className="font-bold"> 5 hours for 8 weeks!</span>
          </Step>
          <Step stepNumber="2" title="Team up" circleRef={step2CircleRef}>
            <span className="font-normal">
              After you qualify, you'll get assigned to a house! Create your
              teams, strategize, and get ready for the game!
            </span>
          </Step>

          <Step
            stepNumber="3"
            title="Play together in May"
            circleRef={step3CircleRef}
          >
            <span className="font-normal">
              You'll embark on an adventure to complete challenges and outplay
              your competitors. The winners get special prizes and eternal
              honor!
            </span>
          </Step>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col gap-12 px-6 pt-12 lg:gap-24 lg:px-48 lg:pt-20">
        <p className="smoothing-black w-full border-b-4 border-black pb-4 text-4xl font-bold text-black lg:text-7xl lg:tracking-[-3px]">
          FAQ
        </p>
      </div>

      <div className="relative z-10 grid w-full grid-cols-1 gap-12 px-6 pt-8 pb-24 md:grid-cols-2 md:gap-x-16 md:gap-y-20 md:px-40 md:pb-32">
        <QuestionAnswer
          question="How's the event gonna look like?"
          answer="Hack Club: The Game will begin online, during which you code and build projects to gain tickets. Once you have enough tickets, you'll qualify to go to Manhattan and play!"
        />

        <QuestionAnswer
          question="Who can participate?"
          answer="Ages 13 through 18, from anywhere in the world can play Hack Club: The Game."
        />

        <QuestionAnswer
          question="When is the event?"
          answer={
            <>
              Hack Club: The Game will take place from May 22nd to May 25th.
              We'll have more details in the coming weeks - join{" "}
              <a
                className="font-bold text-blue-500 underline"
                href="https://hackclub.enterprise.slack.com/archives/C0A7HQZFFNX"
                target="_blank"
              >
                #hctg-bulletin
              </a>{" "}
              on{" "}
              <a
                className="font-bold text-blue-500 underline"
                href="https://hackclub.com/slack"
                target="_blank"
              >
                Slack
              </a>{" "}
              to get notified!
            </>
          }
        />

        <QuestionAnswer
          question="How do I sign up?"
          answer="Enter your email above to sign up for Hack Club: The Game! After you sign up, you can get started making projects, and logging time!"
        />

        <QuestionAnswer
          question="When can I start building projects?"
          answer={
            <>
              Now! We'll have our full platform ready in the coming weeks, but
              you're can start as long as you track your time using{" "}
              <a
                className="font-bold text-blue-500 underline"
                href="https://hackatime.hackclub.com/"
                target="_blank"
              >
                Hackatime
              </a>{" "}
              (coding/art) or{" "}
              <a
                className="font-bold text-blue-500 underline"
                href="https://lapse.hackclub.com"
                target="_blank"
              >
                Lapse
              </a>{" "}
              (hardware/art). Art can only account for up to 10% of your total
              time.
            </>
          }
        />

        <QuestionAnswer
          question="How will the game work?"
          answer={
            <>
              Hack Club: The Game is a territory capture game played in
              Manhattan, inspired by{" "}
              <a
                href="https://www.youtube.com/@jetlagthegame"
                className="font-bold text-blue-500 underline"
                target="_blank"
              >
                Jet Lag: The Game
              </a>
              . More details will be shared gradually, and some will be kept a
              surprise :D
            </>
          }
        />

        <QuestionAnswer
          question="My parents are worried!"
          answer={
            <>
              We'll have round-the-clock supervison to ensure the safety of all
              participants, as well as a first-aid plan. Students will not be
              allowed to freely roam the city outside of game hours, which will
              end before evening. For more information, see our{" "}
              <a
                className="font-bold text-blue-500 underline"
                href="https://hack.club/hctg-parents-guide"
                target="_blank"
              >
                parent's guide
              </a>
              !
            </>
          }
        />

        <QuestionAnswer
          question="What is Hack Club's child protection policy?"
          answer={
            <>
              Hack Club takes the safety and well-being of all participants
              seriously. You can read our full{" "}
              <a
                className="font-bold text-blue-500 underline"
                target="_blank"
                href="https://hackclub.com/safeguarding-policy"
              >
                safeguarding policy
              </a>{" "}
              to learn about our commitment to child protection.
            </>
          }
        />
      </div>

      <HackClubFooter />
    </div>
  );
}
