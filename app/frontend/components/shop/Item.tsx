import { usePage, Link } from "@inertiajs/react";
import type { Item } from "@/interfaces/item";

export default function Item({ item }: { item: Item }) {
  const { props } = usePage();

  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-300 bg-white pt-4 shadow-sm"
      key={item.id}
    >
      <div className="flex items-center justify-between px-4 font-bold">
        <p className="text-xl">{item.name}</p>
        <p className="text-lg">{item.price} 🎫</p>
      </div>
      <p className="p-4">{item.description}</p>
      {props.user.balance < item.price ? (
        <p className="block w-full bg-gray-600 px-3 py-2 text-center text-white">
          Not enough tickets :(
        </p>
      ) : (
        <Link
          className="block w-full bg-green-600 px-3 py-2 text-center text-white"
          href={`/shop/${item.id}/buy`}
          method="post"
        >
          Buy
        </Link>
      )}
    </div>
  );
}
