import { usePage, Link } from "@inertiajs/react";
import type { Item } from "@/interfaces/item";
import ticketIcon from "@/assets/icons/ticket.svg";

export default function Item({ item }: { item: Item }) {
  const { props } = usePage();
  const canAfford = props.user.balance >= item.price;

  return (
    <div>
      <div className="relative h-8 rounded-tl-2xl rounded-tr-2xl bg-black">
        {item.featured && (
          <span className="absolute top-1 right-3 text-sm font-bold text-[#fecb0d]">
            ★ Featured
          </span>
        )}
      </div>
      <div className="rounded-br-2xl rounded-bl-2xl border-2 border-t-0 border-black bg-white px-6 py-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="mb-4 h-40 w-full object-contain"
          />
        )}
        <div className="flex items-start justify-between gap-6">
          <h2 className="smoothing-black text-4xl font-bold tracking-[-0.03em]">
            {item.name}
          </h2>
          <div className="flex items-center gap-1.5">
            <img src={ticketIcon} alt="Tickets" className="h-5 w-5" />
            <span className="smoothing-black text-2xl tracking-[-0.03em]">
              {item.price}
            </span>
          </div>
        </div>
        <p className="smoothing-black mt-2 text-xl tracking-[-0.02em]">
          {item.description}
        </p>
        {canAfford ? (
          <Link
            className="smoothing-white mt-4 block w-full bg-black px-5 py-3 text-center text-xl font-bold tracking-tight text-white transition-colors hover:bg-[#fecb0d] hover:text-black"
            href={`/shop/${item.id}/buy`}
            method="post"
          >
            Buy
          </Link>
        ) : (
          <p className="smoothing-black mt-4 block w-full bg-[#d9d9d9] px-5 py-3 text-center text-xl font-bold tracking-tight text-black/50">
            Not enough tickets
          </p>
        )}
      </div>
    </div>
  );
}
