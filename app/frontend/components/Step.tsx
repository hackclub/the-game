type StepProps = {
  stepNumber?: string;
  title?: string;
  circleRef?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
};

export default function Step({ 
  stepNumber = "1", 
  title = "Code online.",
  circleRef,
  children,
}: StepProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full">
      <div
        ref={circleRef}
        className="bg-black flex flex-col items-center justify-center rounded-full w-24 h-24 lg:w-32 lg:h-32 shrink-0"
      >
        <p className="font-bold text-4xl lg:text-6xl text-white leading-none">
          {stepNumber}
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-2 lg:gap-3 items-start">
        <div className="flex flex-col gap-2 lg:gap-3 items-start text-black w-full">
          <p className="font-bold text-4xl lg:text-7xl leading-none tracking-[-0.1em] lg:tracking-[-7px]">
            {title}
          </p>
          <p className="text-xl lg:text-3xl leading-tight lg:leading-none tracking-[-0.06em] lg:tracking-[-1.92px] max-w-3xl">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
