import { useEffect, useRef, useState } from "react";
import type { Item } from "@/interfaces/item";
import ticketIcon from "@/assets/icons/ticket.svg";

export default function ConfirmPurchaseModal({
  open,
  item,
  quantity,
  totalCost,
  willGoIntoDebt,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  item: Item;
  quantity: number;
  totalCost: number;
  willGoIntoDebt?: boolean;
  onCancel: () => void;
  onConfirm: (note?: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="m-auto w-full max-w-md rounded-2xl border-2 border-black bg-white p-0 backdrop:bg-black/50"
    >
      <div className="bg-black px-6 py-3">
        <h2 className="smoothing-white text-xl font-bold text-white">
          Confirm Purchase
        </h2>
      </div>
      <div className="px-6 py-5">
        <p className="smoothing-black flex flex-wrap items-center gap-1.5 text-xl tracking-[-0.02em]">
          Buy{" "}
          <span className="font-bold">
            {quantity}x {item.name}
          </span>{" "}
          for
          <img src={ticketIcon} alt="Tickets" className="inline h-5 w-5" />
          <span className="font-bold tracking-[-0.03em]">{totalCost}</span>?
        </p>
        {willGoIntoDebt && (
          <p className="mt-3 rounded border border-red-400 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
            ⚠ This purchase will put you into negative tickets! You'll need to
            complete hours after the event to pay it off.
          </p>
        )}
        <div className="my-6 flex flex-col">
          <label className="text-lg font-bold">Note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="smoothing-black flex-1 cursor-pointer rounded-none border-2 border-black px-5 py-3 text-center text-lg font-bold tracking-tight transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(note)}
            className="smoothing-white flex-1 cursor-pointer rounded-none bg-black px-5 py-3 text-center text-lg font-bold tracking-tight text-white transition-colors hover:bg-[#fecb0d] hover:text-black"
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}
