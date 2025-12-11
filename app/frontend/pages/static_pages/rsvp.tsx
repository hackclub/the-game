import { useState, useRef, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Step from '../../components/Step';
import QuestionAnswer from '../../components/QuestionAnswer';
import DynamicBackgroundLines from '../../components/DynamicBackgroundLines';
import HackClubLogo from '../../components/HackClubLogo';
import ArrowVector from '../../components/ArrowVector';
import HackClubFooter from '../../components/HackClubFooter';

export default function RsvpPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const step1CircleRef = useRef<HTMLDivElement>(null);
  const step2CircleRef = useRef<HTMLDivElement>(null);
  const step3CircleRef = useRef<HTMLDivElement>(null);

  const { data, setData, post, reset } = useForm({ email: '' });

  useEffect(() => {
    if (showSuccess) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
      const hideTimer = setTimeout(() => {
        setShowSuccess(false);
        setFadeOut(false);
      }, 3500);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showSuccess]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowScrollArrow(scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/rsvp', {
      onSuccess: () => {
        reset();
        setShowSuccess(true);
      },
    });
  };

  return (
    <div className="bg-white flex flex-col items-start relative w-full">
      <Head title="Hack Club: The Game" />
      <DynamicBackgroundLines stepCircleRefs={[step1CircleRef, step2CircleRef, step3CircleRef]} />

      <div className="relative z-10 flex items-center justify-center w-full min-h-screen px-4 py-12 lg:py-24">
        <div className="flex flex-col items-end w-full max-w-none lg:max-w-6xl">
          <div className="bg-white border-black border-solid border-t-[30px] lg:border-t-[30px] border-r-4 border-b-4 border-l-4 w-full flex flex-col lg:flex-row">
            <div className="flex items-center justify-center px-6 py-6 bg-white lg:border-r-0">
              <div className="h-20 lg:h-24 w-auto">
                <HackClubLogo className="block max-w-none h-full w-auto" />
              </div>
            </div>

            <div className="border-t-4 lg:border-t-0 lg:border-l-4 border-black flex-1 flex flex-col px-6 lg:px-10 py-6 lg:py-8 bg-white">
              <div className="mb-4">
                <p className="text-2xl sm:text-3xl lg:text-6xl xl:text-8xl tracking-[-0.05em] leading-tight lg:leading-none whitespace-nowrap">
                  <span className="font-normal">hack club: </span>
                  <span className="font-bold">the game.</span>
                </p>
              </div>
              <div className="text-lg lg:text-2xl xl:text-3xl tracking-[-0.04em] leading-tight lg:leading-none space-y-1">
                <p>Code online, then join us in a</p>
                <p>Jetlag-inspired adventure across Manhattan.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full mt-4 h-20">
            <div className="bg-white border-4 border-black px-4 lg:px-6 sm:flex-1 h-full flex">
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full text-lg lg:text-3xl tracking-[-0.04em] text-black bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0 font-[Arial]"
              />
            </div>

            <button
              type="submit"
              className="bg-white border-4 border-black flex items-center justify-center gap-3 lg:gap-4 px-4 lg:px-6 py-4 lg:py-6 hover:bg-black hover:text-white transition-colors w-full h-full sm:w-auto cursor-pointer"
            >
              <div className="w-6 h-6 lg:w-7 lg:h-7">
                <ArrowVector className="block max-w-none w-full h-full" />
              </div>
              <span className="font-bold text-xl lg:text-4xl tracking-[-0.09em]">
                RSVP
              </span>
            </button>
          </form>

          <p
            className={`mt-4 text-lg lg:text-2xl tracking-[-0.04em] text-black font-bold transition-opacity duration-500 w-full ${showSuccess && !fadeOut ? 'opacity-100' : 'opacity-0'}`}
          >
            Thanks, we'll e-mail you updates!
          </p>


        </div>

        {showScrollArrow && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce group cursor-pointer flex flex-col items-center transition-opacity duration-300">
            <span className="text-sm font-bold tracking-[-0.04em] opacity-0 group-hover:opacity-100 transition-opacity mb-1">scroll</span>
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
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-12 lg:gap-24 w-full px-6 lg:px-48 pb-24 lg:pb-40">
        <Step stepNumber="1" title="Code online." circleRef={step1CircleRef}>
          <span className="font-normal">Collect tokens by coding! You can exchange your tokens for items in the real-life game. After you get enough tokens, </span>
          <span className="font-bold">you qualify!</span>
        </Step>

        <Step stepNumber="2" title="Team up." circleRef={step2CircleRef}>
          <span className="font-normal">After you qualify, you'll get assigned to a team! Create your plans, strategize, and get ready for the game!</span>
        </Step>

        <Step stepNumber="3" title="Play IRL." circleRef={step3CircleRef}>
          <span className="font-normal">We all go to Manhattan, and play a game of Jet Lag! The winners get special prizes and eternal honor.</span>
        </Step>
      </div>

      <div className="relative z-10 flex flex-col gap-12 lg:gap-24 w-full px-6 lg:px-48 pt-12 lg:pt-20">
        <p className="text-4xl lg:text-7xl tracking-[-0.1em] lg:tracking-[-7px] text-black font-bold border-b-4 border-black pb-4 w-full">FAQ</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-20 w-full px-6 md:px-40 pt-8 pb-24 md:pb-32">
        <QuestionAnswer
          question="How's the event gonna look like?"
          answer="We're gonna have two stages - an online part and an IRL part. During the online part, you code and build projects to gain tokens depending on the amount of time you put in. If you have enough tokens, you can qualify to the in-person part, where we go to Manhattan and play a IRL boardgame inspired competition across Manhattan!"
        />
        <QuestionAnswer
          question="Who can participate?"
          answer="Ages 14 through 18, from anywhere in the world! We provide travel stipends for those abroad. You'll have to get enough points in the online part, though!"
        />

        <QuestionAnswer
          question="When is the event?"
          answer="HCTG will take place sometime in Mid March. We'll have more details in the coming weeks."
        />




        <QuestionAnswer
          question="How do I sign up"
          answer="You can start by RSVPing above. We're still working on our platform where you'll sumbit your projects. We'll send an email when it's ready"
        />

        <QuestionAnswer
          question="What's the IRL part about?"
          answer="We will split Manhattan into equally sized blocks, and have teams compete against each other to conquer as much of Manhattan as possible and gain the most points possible by the end! We'll reveal more details about the mechanics during the online part. It's inspired by Jetlag"
        />


        <QuestionAnswer
          question="How do I qualify?"
          answer="You need to code and build projects in exchange for tokens depending on the amount of hours you put in. You'll need to get enough tokens to qualify for the in-person part"
        />



        <QuestionAnswer
          question="Will my child be safe?"
          answer="Yes, we'll have round-the clock supervison and security to ensure the safety of all participants by background checked adult volunteers, as well as a first-aid plan in case of any injuries. Students will not be allowed to freely roam the city outside of the game hours. "
        />

        <QuestionAnswer
          question="My Parents are worried, do you have a parents guide?"
          answer="We're working on a parents guide and will have one in the coming weeks. "
        />

      </div>

      <HackClubFooter />
    </div>
  );
}
