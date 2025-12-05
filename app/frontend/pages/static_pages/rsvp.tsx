import { useState, useRef } from 'react';
import { Form } from '@inertiajs/react';
import Step from '../../components/Step';
import QuestionAnswer from '../../components/QuestionAnswer';
import DynamicBackgroundLines from '../../components/DynamicBackgroundLines';
import HackClubLogo from '../../components/HackClubLogo';
import ArrowVector from '../../components/ArrowVector';

export default function RsvpPage() {
  const [email, setEmail] = useState('');
  const step1CircleRef = useRef<HTMLDivElement>(null);
  const step2CircleRef = useRef<HTMLDivElement>(null);
  const step3CircleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white flex flex-col items-start relative w-full min-h-screen">
      {/* Background Lines */}
      <DynamicBackgroundLines stepCircleRefs={[step1CircleRef, step2CircleRef, step3CircleRef]} />

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen px-4 py-12 lg:py-24">
        <div className="flex flex-col items-end w-full max-w-none lg:max-w-6xl">
          {/* Logo + CTA Container */}
          <div className="bg-white border-black border-solid border-t-[30px] lg:border-t-[30px] border-r-4 border-b-4 border-l-4 w-full flex flex-col lg:flex-row">
            {/* Logo Section */}
            <div className="flex items-center justify-center px-6 py-6 bg-white lg:border-r-0">
              <div className="h-20 lg:h-24 w-auto">
                <HackClubLogo className="block max-w-none h-full w-auto" />
              </div>
            </div>
            
            {/* Wordmark + CTA Section */}
            <div className="border-t-4 lg:border-t-0 lg:border-l-4 border-black flex-1 flex flex-col px-6 lg:px-10 py-6 lg:py-8 bg-white">
              <div className="mb-4">
                <p className="text-2xl sm:text-3xl lg:text-6xl xl:text-8xl tracking-[-0.05em] leading-tight lg:leading-none whitespace-nowrap">
                  <span className="font-normal">hack club: </span>
                  <span className="font-bold">the game.</span>
                </p>
              </div>
              <div className="text-lg lg:text-2xl xl:text-3xl tracking-[-0.04em] leading-tight lg:leading-none space-y-1">
                <p>Code online, then join us in a</p>
                <p>hide-and-seek competition across Manhattan.</p>
              </div>
            </div>
          </div>

          {/* RSVP Button & Email Group */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full mt-4 h-20">
            <div className="bg-white border-4 border-black px-4 lg:px-6 sm:flex-1 h-full flex
            ">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full text-lg lg:text-3xl tracking-[-0.04em] text-gray-600 bg-transparent border-none outline-none placeholder-gray-400"
              />
            </div>
            
            <Form method="post" action="/rsvp" className="h-full">
              <input type="hidden" name="email" value={email} />
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
            </Form>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="relative z-10 flex flex-col gap-12 lg:gap-24 w-full px-6 lg:px-48 pb-24 lg:pb-40">
        <Step 
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full"
          stepNumber="1"
          title="Code online."
          description="Collect tokens by coding! You can exchange your tokens for items in the real-life game. After you get enough tokens, "
          descriptionHighlight="you qualify!"
          circleRef={step1CircleRef}
        />
        
        <Step 
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full"
          stepNumber="2"
          title="Team up."
          description="After you qualify, you'll get assigned to a team! Create your plans, strategize, and get ready for the game!"
          circleRef={step2CircleRef}
        />
        
        <Step 
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full"
          stepNumber="3"
          title="Play IRL."
          description="We all go to Manhattan, and play a game of Jet Lag! The winners get special prizes and eternal honor."
          circleRef={step3CircleRef}
        />
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 flex flex-col gap-12 lg:gap-20 w-full px-6 lg:px-40 pt-8 pb-24 lg:pb-32">
        <QuestionAnswer 
          className="flex flex-col gap-4 items-start w-full"
          question="How's the event gonna look like?"
          answer="We're gonna have two stages - an online part and an IRL part. During the online part, you code and gain points depending on the amount of time you put in. If you have enough hours, you can qualify to the in-person part, where we go to Manhattan and go on a hide-and-seek competition!"
        />
        
        <QuestionAnswer 
          className="flex flex-col gap-4 items-start w-full"
          question="Who can participate?"
          answer="Ages 14 through 18, from anywhere in the world! We provide travel stipends for those abroad. You'll have to get enough points in the online part, though!"
        />
        
        <QuestionAnswer 
          className="flex flex-col gap-4 items-start w-full"
          question="What's the IRL part about?"
          answer="We will split Manhattan into equally sized blocks, and have teams compete against each other to conquer as much of Manhattan as possible and gain the most points possible by the end! We'll reveal more details about the mechanics during the online part."
        />
      </div>
    </div>
  );
}
