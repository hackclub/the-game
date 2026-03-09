import { Order } from "@/interfaces/order";
import { Item } from "@/interfaces/item";
import { usePage } from "@inertiajs/react";

export default function OrderCard({
  order,
}: {
  order: Order & { item: Item };
}) {
  const { props } = usePage();

  const content = (
    <>
      {order.item.image && (
        <img
          src={order.item.image}
          alt={order.item.name}
          className="h-16 w-16 object-contain"
        />
      )}
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="font-bold">{order.item.name}</p>
          <p className="text-sm text-gray-500">
            Order #{order.id} · {order.item.price} ticket
            {order.item.price !== 1 && "s"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            {
              pending: "bg-yellow-100 text-yellow-800",
              processing: "bg-blue-100 text-blue-800",
              fulfilled: "bg-green-100 text-green-800",
              cancelled: "bg-red-100 text-red-800",
            }[order.aasm_state] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {order.aasm_state}
        </span>
      </div>
    </>
  );

  if (props.user.role === "admin") {
    return (
      <a
        key={order.id}
        href={`/shop/orders/${order.id}`}
        className="mb-4 flex items-center gap-4 rounded-md border bg-gray-50 p-4 transition-colors"
      >
        {content}
      </a>
    );
  } else {
    return (
      <div
        key={order.id}
        className="mb-4 flex items-center gap-4 rounded-md border bg-gray-50 p-4 transition-colors"
      >
        {content}
      </div>
    );
  }
}
