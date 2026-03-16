import { Link } from "@inertiajs/react";
import type { Item } from "@/interfaces/item";

export default function ReferralItem({ item }: { item: Item }) {
  return (
    <div className="rounded-2xl border-2 border-[#fecb0d] bg-[#fef9e7] p-6">
      <div className="flex items-center gap-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-24 shrink-0 rounded-xl object-contain"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="smoothing-black text-2xl font-bold">
              🎁 {item.name}
            </h2>
            <span className="rounded-full bg-[#fecb0d] px-3 py-1 text-sm font-bold">
              FREE
            </span>
          </div>
          <p className="smoothing-black mt-1 text-lg text-gray-700">
            {item.description}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            You were referred — claim this item for free!
          </p>
        </div>
        <Link
          href={`/shop/${item.id}/claim_referral_item`}
          method="post"
          className="smoothing-white shrink-0 rounded-xl border-2 border-black bg-black px-6 py-3 text-lg font-bold text-white no-underline transition-colors hover:bg-[#fecb0d] hover:text-black"
        >
          Claim Free
        </Link>
      </div>
    </div>
  );
}
