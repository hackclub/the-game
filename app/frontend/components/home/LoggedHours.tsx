import formatTime from "@/utils/formatTime";
import ticketIcon from "@/assets/icons/ticket.svg";
import type { Goal } from "@/interfaces/goal";

function QualifyBar({
  totalProjectTime,
  inProgressTime,
  reviewTime,
  tickets,
  boughtInvite,
}: {
  totalProjectTime: number;
  inProgressTime: number;
  reviewTime: number;
  tickets: number;
  boughtInvite: boolean;
}) {
  const hours = Math.floor(totalProjectTime / 3600);
  const minutes = Math.floor((totalProjectTime % 3600) / 60);

  const stats = (
    <>
      <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
        You currently have <span className="font-bold">{tickets} tickets</span>.
      </p>
      {boughtInvite ? (
        <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
          You've already bought your invite to the game - keep hacking to buy
          travel stipends and other cool stuff!
        </p>
      ) : (
        <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
          In total, you've logged{" "}
          <span className="font-bold">
            {hours} hours and {minutes} minute{minutes === 1 ? "" : "s"}!
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
              <span className="font-bold">{formatTime(reviewTime)}</span> under
              review.
            </>
          )}
        </p>
      )}
    </>
  );

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex items-center">
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-[#fecb0d]" />
        <div className="relative -mx-3 h-5 flex-1 overflow-hidden rounded-full bg-black">
          <div className="absolute inset-y-0 left-0 w-full bg-[#fecb0d]" />
        </div>
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-[#fecb0d]" />
      </div>

      <div className="mt-1 flex items-start justify-between px-1">
        <span className="smoothing-black pl-12 text-2xl font-bold tracking-tight">
          Begin
        </span>
        <div className="hidden px-10 lg:block">{stats}</div>
        <span className="smoothing-black min-w-max pr-12 text-2xl font-bold tracking-tight">
          Eligible to Qualify
        </span>
      </div>
      <div className="mt-4 px-1 text-center lg:hidden">{stats}</div>
    </div>
  );
}

function GoalBar({ goal, tickets }: { goal: Goal; tickets: number }) {
  const target = goal.item.price;
  const progress = target > 0 ? Math.min(Math.max(tickets / target, 0), 1) : 1;
  const complete = progress >= 1;
  const remaining = Math.max(target - tickets, 0);

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center">
        {/* Start node */}
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-[#fecb0d]" />

        {/* Track */}
        <div className="relative -mx-3 h-5 flex-1 overflow-hidden rounded-full bg-black">
          <div
            className="absolute inset-y-0 left-0 bg-[#fecb0d] transition-[width] duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* End node — shows the item image on top of the circle */}
        <div
          className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 transition-colors ${
            complete ? "border-[#fecb0d] bg-white" : "border-black bg-white"
          }`}
        >
          {goal.item.image ? (
            <img
              src={goal.item.image}
              alt={goal.item.name}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <img src={ticketIcon} alt="" className="h-7 w-7" />
          )}
        </div>
      </div>

      {/* Pull the caption up toward the track — the 64px end circles overhang
          the 20px bar, leaving dead space we don't want between bar and text. */}
      <p className="smoothing-black -mt-2 text-center text-xl tracking-[-0.03em]">
        {complete ? (
          <>
            You can grab the <span className="font-bold">{goal.item.name}</span>
            !
          </>
        ) : (
          <>
            <span className="font-bold">{remaining}</span> more ticket
            {remaining === 1 ? "" : "s"} until the{" "}
            <span className="font-bold">{goal.item.name}</span>
          </>
        )}
      </p>
    </div>
  );
}

export default function LoggedHours({
  totalProjectTime,
  inProgressTime,
  reviewTime,
  tickets,
  boughtInvite,
  goals,
}: {
  totalProjectTime: number;
  inProgressTime: number;
  reviewTime: number;
  tickets: number;
  boughtInvite: boolean;
  goals: Goal[];
}) {
  return (
    <div className="flex w-full flex-col gap-10">
      <QualifyBar
        totalProjectTime={totalProjectTime}
        inProgressTime={inProgressTime}
        reviewTime={reviewTime}
        tickets={tickets}
        boughtInvite={boughtInvite}
      />
      {goals.length > 0 && (
        <div className="flex flex-col gap-8">
          {goals.map((goal) => (
            <GoalBar key={goal.id} goal={goal} tickets={tickets} />
          ))}
        </div>
      )}
    </div>
  );
}
