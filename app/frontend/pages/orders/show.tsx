import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { Order } from "@/interfaces/orders";

interface Props {
  order: Order;
}

export default function ShowOrder({ orders }: Props) {
  return (
    <Layout>
      <PageHeading eyebrow="Orders" title={`Order #${orders.id}`} />

      <div className="mt-6 space-y-2 px-4 text-xl md:px-16">
        <p>
          <span className="font-semibold">User ID:</span> {orders.user_id}
        </p>
        <p>
          <span className="font-semibold">Item ID:</span> {orders.item_id}
        </p>
      </div>
    </Layout>
  );
}
