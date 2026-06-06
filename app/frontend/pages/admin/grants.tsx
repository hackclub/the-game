import Layout from "@/layouts/layout";
import type { Item } from "@/interfaces/item";
import { useState } from "react";

const DEFAULT_MERCHANT_LOCK =
  "L0WVK2LSSWP2ZDR,BIGQEGVYNMN4O0C,395700028300,PL7WUQLGJ9RI3YX,IAMND6350ILIORH,395700028379,000311035246884,485450000197086,000311035249888,485453000197086";

function GrantCard({ item }: { item: Item & { pending_count: number } }) {
  const [amountDollars, setAmountDollars] = useState("10");
  const [purpose, setPurpose] = useState("Domain grant");
  const [oneTimeUse, setOneTimeUse] = useState(true);
  const [merchantLock, setMerchantLock] = useState(DEFAULT_MERCHANT_LOCK);
  const [inviteMessage, setInviteMessage] = useState("");

  function download() {
    const params = new URLSearchParams({
      amount_cents: String(Math.round(parseFloat(amountDollars) * 100)),
      purpose,
      one_time_use: String(oneTimeUse),
      merchant_lock: merchantLock,
      invite_message: inviteMessage,
    });
    window.location.href = `/admin/grants/${item.id}/csv?${params}`;
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-black bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.pending_count} pending order{item.pending_count !== 1 && "s"}</p>
        </div>
        {item.image && (
          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-contain" />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold">Amount ($)</label>
          <input
            className="rounded-md border-2 border-black px-2 py-1"
            type="number"
            min="0"
            step="0.01"
            value={amountDollars}
            onChange={(e) => setAmountDollars(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold">Purpose <span className="font-normal text-gray-400">(max 30 chars)</span></label>
          <input
            className="rounded-md border-2 border-black px-2 py-1"
            type="text"
            maxLength={30}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-bold">Merchant lock</label>
          <input
            className="rounded-md border-2 border-black px-2 py-1 font-mono text-xs"
            type="text"
            value={merchantLock}
            onChange={(e) => setMerchantLock(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-bold">Invite message <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            className="rounded-md border-2 border-black px-2 py-1"
            type="text"
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id={`one_time_use_${item.id}`}
            type="checkbox"
            checked={oneTimeUse}
            onChange={(e) => setOneTimeUse(e.target.checked)}
          />
          <label htmlFor={`one_time_use_${item.id}`} className="text-sm font-bold">One-time use</label>
        </div>
      </div>

      <button
        className="cursor-pointer rounded-xl border-2 border-black bg-black px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={download}
        disabled={item.pending_count === 0}
      >
        Download CSV ({item.pending_count} rows)
      </button>
    </div>
  );
}

export default function Grants({ items }: { items: (Item & { pending_count: number })[] }) {
  return (
    <Layout>
      <div className="px-8 py-6">
        <h1 className="mb-1 text-4xl font-bold">Grants</h1>
        <p className="mb-6 text-gray-500 italic">Export grant CSVs for pending orders</p>

        {items.length === 0 ? (
          <p className="rounded-2xl border-2 border-black bg-white p-6 text-center text-gray-500">
            No items with the "grants" category found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {items.map((item) => (
              <GrantCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
