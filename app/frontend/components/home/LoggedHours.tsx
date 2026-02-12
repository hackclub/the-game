const QUALIFIED_HOURS = 40;

export default function LoggedHours({
  totalProjectTime,
}: {
  totalProjectTime: number;
}) {
  const hours = Math.floor(totalProjectTime / 3600);
  const minutes = Math.floor((totalProjectTime % 3600) / 60);
  const progress = Math.min(totalProjectTime / (QUALIFIED_HOURS * 3600), 1);

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex items-center">
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-[#fecb0d]" />
        <div className="relative -mx-3 flex-1 h-5 overflow-hidden rounded-full bg-black">
          <div
            className="absolute inset-y-0 left-0 bg-[#fecb0d]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className={`relative z-10 h-16 w-16 shrink-0 rounded-full ${progress == 1 ? "bg-[#fecb0d]" : "bg-black"}`} />
      </div>
      
      <div className="flex items-start justify-between px-1 mt-1">
        <span className="text-2xl font-bold tracking-tight pl-12 smoothing-black">Begin</span>
        <p className="text-2xl tracking-[-0.04em] text-center smoothing-black">
          You've logged{" "}
          <span className="font-bold">
            {hours} hours and {minutes} minutes{progress == 1 ? "!" : "."}
          </span>
        </p>
        <span className="text-2xl font-bold tracking-tight pr-12 smoothing-black">Qualified</span>
      </div>
    </div>
  );
}
