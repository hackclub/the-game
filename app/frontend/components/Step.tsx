type StepProps = {
  className?: string;
  stepNumber?: string;
  title?: string;
  description?: string;
  descriptionHighlight?: string;
  circleRef?: React.Ref<HTMLDivElement>;
};

export default function Step({ 
  className, 
  stepNumber = "1", 
  title = "Code online.", 
  description = "Collect tokens by coding! You can exchange your tokens for items in the real-life game. After you get enough tokens, ",
  descriptionHighlight = "you qualify!",
  circleRef,
}: StepProps) {
  return (
    <div className={className}>
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
            <span className="font-normal">{description}</span>
            {descriptionHighlight && <span className="font-bold">{descriptionHighlight}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
