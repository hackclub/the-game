const QUALIFIED_HOURS = 40;

export default function LoggedHours({
  totalProjectTime,
  totalApprovedProjectTime,
}: {
  totalProjectTime: number;
  totalApprovedProjectTime: number;
}) {
  const hours = Math.floor(totalProjectTime / 3600);
  const minutes = Math.floor((totalProjectTime % 3600) / 60);
  const progress = Math.min(totalProjectTime / (QUALIFIED_HOURS * 3600), 1);

  const approved_hours = Math.floor(totalApprovedProjectTime / 3600);
  const approved_minutes = Math.floor((totalApprovedProjectTime % 3600) / 60);  

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex items-center">
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-[#fecb0d]" />
        <div className="relative -mx-3 h-5 flex-1 overflow-hidden rounded-full bg-black">
          <div
            className="absolute inset-y-0 left-0 bg-[#fecb0d]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div
          className={`relative z-10 h-16 w-16 shrink-0 rounded-full ${progress == 1 ? "bg-[#fecb0d]" : "bg-black"}`}
        />
      </div>

      <div className="mt-1 flex items-start justify-between px-1">
        <span className="smoothing-black pl-12 text-2xl font-bold tracking-tight">
          Begin
        </span>
        <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
          You've logged{" "}
          <span className="font-bold">
            {hours} hours and {minutes} minutes{progress == 1 ? "!" : "."}
          </span>
        </p>
        <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
          Of that,{" "}
          <span className="font-bold">
            {approved_hours} hours and {approved_minutes} minutes are approved.
          </span>
        </p>
        <span className="smoothing-black pr-12 text-2xl font-bold tracking-tight">
          Eligible to Qualify
        </span>
      </div>
    </div>
  );
}
