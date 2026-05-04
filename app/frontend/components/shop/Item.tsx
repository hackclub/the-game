import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import type { Item } from "@/interfaces/item";
import type { SharedProps } from "@/types";
import ticketIcon from "@/assets/icons/ticket.svg";
import ConfirmPurchaseModal from "./ConfirmPurchaseModal";

export default function Item({
  item,
  alreadyPurchased,
  className,
}: {
  item: Item & { stock_left: number };
  alreadyPurchased: boolean;
  className?: string;
}) {
  const { props } = usePage<SharedProps>();
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const totalCost = item.price * quantity;
  const canAfford = props.user.balance >= totalCost;
  const idvVerified = props.user.verification_status === "verified";
  const maxQuantity = Math.max(1, Math.floor(props.user.balance / item.price));
  const canOverspendBuy =
    props.user.can_overspend &&
    item.event_related &&
    !canAfford &&
    !(item.id === 3 && props.user.balance < 20);

  return (
    <div className={`flex h-full flex-col${className ? ` ${className}` : ""}`}>
      <div className="relative h-8 rounded-tl-2xl rounded-tr-2xl bg-black">
        {item.black_market && (
          <span className="absolute top-2 left-3 text-sm font-bold text-purple-500">
            🔮 Black Market
          </span>
        )}
        {item.super_featured && (
          <span className="absolute top-2 right-3 text-sm font-bold text-[#fecb0d]">
            ★ Super Featured
          </span>
        )}
        {!item.super_featured && item.featured && (
          <span className="absolute top-2 right-3 text-sm font-bold text-[#fecb0d]">
            ★ Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col rounded-br-2xl rounded-bl-2xl border-2 border-t-0 border-black bg-white px-6 py-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className={`mb-4 w-full object-contain ${item.super_featured ? "h-64" : "h-40"}`}
          />
        )}
        <div className="flex items-start justify-between gap-6">
          <h2 className="smoothing-black text-4xl font-bold tracking-[-0.03em]">
            {item.name}
          </h2>
          <div className="flex items-center gap-1.5">
            <img src={ticketIcon} alt="Tickets" className="h-5 w-5" />
            <span className="smoothing-black text-2xl tracking-[-0.03em]">
              {totalCost}
            </span>
          </div>
        </div>
        {item.stock && <p className="text-lg">{item.stock_left} left!</p>}
        <p className="smoothing-black mt-2 text-xl tracking-[-0.02em]">
          {item.description}
        </p>
        <div className="mt-auto">
          {alreadyPurchased ? (
            <p className="smoothing-black mt-4 block w-full bg-[#d9d9d9] px-5 py-3 text-center text-xl font-bold tracking-tight text-black/50">
              Already purchased
            </p>
          ) : (
            <>
              {!item.one_per_user && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded border-2 border-black bg-white text-xl font-bold transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={!idvVerified || quantity <= 1}
                  >
                    −
                  </button>
                  <span className="smoothing-black w-10 text-center text-xl font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded border-2 border-black bg-white text-xl font-bold transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={!idvVerified || quantity >= maxQuantity}
                  >
                    +
                  </button>
                </div>
              )}
              {!idvVerified ? (
                <button
                  type="button"
                  disabled
                  className="smoothing-black mt-4 block w-full cursor-not-allowed bg-[#d9d9d9] px-5 py-3 text-center text-xl font-bold tracking-tight text-black/50"
                >
                  Verify to buy
                </button>
              ) : item.black_market && !props.user.wizard ? (
                <button
                  type="button"
                  disabled
                  className="smoothing-black mt-4 block w-full cursor-not-allowed bg-yellow-600/60 px-5 py-3 text-center text-xl font-bold tracking-tight text-white"
                >
                  Golden ticket required
                </button>
              ) : canAfford ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="smoothing-white mt-4 block w-full cursor-pointer bg-black px-5 py-3 text-center text-xl font-bold tracking-tight text-white transition-colors hover:bg-[#fecb0d] hover:text-black"
                  >
                    Buy{quantity > 1 ? ` (${quantity})` : ""}
                  </button>
                  <ConfirmPurchaseModal
                    open={showConfirm}
                    item={item}
                    quantity={quantity}
                    totalCost={totalCost}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={(note?: string) => {
                      setShowConfirm(false);
                      router.post(`/shop/${item.id}/buy`, { quantity, note });
                    }}
                  />
                </>
              ) : canOverspendBuy ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="smoothing-white mt-4 block w-full cursor-pointer bg-black px-5 py-3 text-center text-xl font-bold tracking-tight text-white transition-colors hover:bg-[#fecb0d] hover:text-black"
                  >
                    Buy (will go into debt)
                    {quantity > 1 ? ` (${quantity})` : ""}
                  </button>
                  <ConfirmPurchaseModal
                    open={showConfirm}
                    item={item}
                    quantity={quantity}
                    totalCost={totalCost}
                    willGoIntoDebt
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={(note?: string) => {
                      setShowConfirm(false);
                      router.post(`/shop/${item.id}/buy`, { quantity, note });
                    }}
                  />
                </>
              ) : (
                <p className="smoothing-black mt-4 block w-full bg-[#d9d9d9] px-5 py-3 text-center text-xl font-bold tracking-tight text-black/50">
                  Not enough tickets
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
