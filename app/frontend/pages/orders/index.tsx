import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import { Order } from "@/interfaces/order";
import type { Item } from "@/interfaces/item";
import OrderCard from "@/components/orders/Order";

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
          <OrderCard order={order} />
        ))}
      </div>
    </Layout>
  );
}
