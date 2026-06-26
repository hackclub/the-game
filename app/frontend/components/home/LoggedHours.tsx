import formatTime from "@/utils/formatTime";
import ticketIcon from "@/assets/icons/ticket.svg";
import type { Goal } from "@/interfaces/goal";

function GoalBar({ goal, tickets }: { goal: Goal; tickets: number }) {
  const target = goal.item.price;
  const progress = target > 0 ? Math.min(Math.max(tickets / target, 0), 1) : 1;
  const complete = progress >= 1;
  const remaining = Math.max(target - tickets, 0);

  return (
    <div className="flex flex-col gap-2">
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

      <p className="smoothing-black text-center text-xl tracking-[-0.03em]">
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
  inProgressTime,
  tickets,
  goals,
}: {
  inProgressTime: number;
  tickets: number;
  goals: Goal[];
}) {
  return (
    <div className="flex w-full flex-col gap-10">
      {goals.length > 0 && (
        <div className="flex flex-col gap-8">
          {goals.map((goal) => (
            <GoalBar key={goal.id} goal={goal} tickets={tickets} />
          ))}
        </div>
      )}

      {inProgressTime > 0 && (
        <p className="smoothing-black text-center text-2xl tracking-[-0.04em]">
          You haven't shipped{" "}
          <span className="font-bold">{formatTime(inProgressTime)}</span> yet.
        </p>
      )}
    </div>
  );
}
