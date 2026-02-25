import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import { Order } from "@/interfaces/order";
import type { Item } from "@/interfaces/item";

interface OrderWithItem extends Order {
  item: Item;
}

interface Props {
  orders: OrderWithItem[];
}

export default function ViewOrders({ orders }: Props) {
  return (
    <Layout>
      <PageHeading eyebrow="Shop" title="My Orders" />
      <div className="mt-8 px-8">
        {orders.map((order) => (
          <a
            key={order.id}
            href={`/orders/${order.id}`}
            className="mb-4 flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-gray-50"
          >
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
                  Order #{order.id} · {order.item.price} tickets
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
          </a>
        ))}
      </div>
    </Layout>
  );
}
