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
    <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:gap-16">
      <div
        ref={circleRef}
        className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-black lg:h-32 lg:w-32"
      >
        <p className="text-4xl leading-none font-bold text-white lg:text-6xl">
          {stepNumber}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-start gap-2 lg:gap-3">
        <div className="flex w-full flex-col items-start gap-2 text-black lg:gap-3">
          <p className="text-4xl leading-none font-bold tracking-[-0.1em] lg:text-7xl lg:tracking-[-7px]">
            {title}
          </p>
          <p className="max-w-3xl text-xl leading-tight tracking-[-0.06em] lg:text-3xl lg:leading-none lg:tracking-[-1.92px]">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
