import Layout from "@/layouts/layout";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import { Order } from "@/interfaces/order";
import type { Item } from "@/interfaces/item";
import OrderCard from "@/components/orders/Order";
import { Link } from "@inertiajs/react";

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
      <div className="mt-8 flex flex-col gap-8 px-8">
        <IdvVerificationAlert />

        {orders.length === 0 && (
          <p className="text-xl">
            No orders yet! Head over to the{" "}
            <Link href="/shop" className="text-blue-500 underline">
              Shop
            </Link>{" "}
            to order something.
          </p>
        )}
        {orders.map((order) => (
          <OrderCard order={order} />
        ))}
      </div>
    </Layout>
  );
}
