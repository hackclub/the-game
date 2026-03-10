import formatTime from "@/utils/formatTime";

const QUALIFIED_TICKETS = 40;

export default function LoggedHours({
  totalProjectTime,
  inProgressTime,
  reviewTime,
  tickets,
}: {
  totalProjectTime: number;
  inProgressTime: number;
  reviewTime: number;
  tickets: number;
}) {
  const hours = Math.floor(totalProjectTime / 3600);
  const minutes = Math.floor((totalProjectTime % 3600) / 60);

  const ticketProgress = Math.min(tickets / QUALIFIED_TICKETS, 1);
  const reportedProgress = Math.min(
    totalProjectTime / (3600 * QUALIFIED_TICKETS),
    1,
  );

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex items-center">
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-[#fecb0d]" />
        <div className="relative -mx-3 h-5 flex-1 overflow-hidden rounded-full bg-black">
          <div
            className="absolute inset-y-0 left-0 bg-red-500"
            style={{ width: `${reportedProgress * 100}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-[#fecb0d]"
            style={{ width: `${ticketProgress * 100}%` }}
          />
        </div>
        <div
          className={`relative z-10 h-16 w-16 shrink-0 rounded-full ${ticketProgress == 1 ? "bg-[#fecb0d]" : "bg-black"}`}
        />
      </div>

      <div className="mt-1 flex items-start justify-between px-1">
        <span className="smoothing-black pl-12 text-2xl font-bold tracking-tight">
          Begin
        </span>
        <div className="px-10">
          <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
            You currently have{" "}
            <span className="font-bold">{tickets} tickets</span>.
          </p>
          <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
            In total, you've logged{" "}
            <span className="font-bold">
              {hours} hours and {minutes} minutes
              {ticketProgress == 1 ? "!" : "."}
            </span>
            {inProgressTime > 0 && (
              <>
                <br />
                You haven't shipped{" "}
                <span className="font-bold">
                  {formatTime(inProgressTime)}
                </span>{" "}
                yet.
              </>
            )}
            {reviewTime > 0 && (
              <>
                <br />
                You have{" "}
                <span className="font-bold">{formatTime(reviewTime)}</span>{" "}
                under review.
              </>
            )}
          </p>
        </div>
        <span className="smoothing-black min-w-max pr-12 text-2xl font-bold tracking-tight">
          Eligible to Qualify
        </span>
      </div>
    </div>
  );
}
