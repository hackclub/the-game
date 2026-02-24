import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { Order } from "@/interfaces/orders";
import type { PrivateUser } from "@/interfaces/user";
import type { Item } from "@/interfaces/item";

interface Props {
  orders: Order;
  order_user: PrivateUser;
  item: Item;
}

export default function ShowOrder({ orders, order_user, item }: Props) {
  return (
    <Layout>
      <PageHeading eyebrow="Orders" title={`Order #${orders.id}`} />

      <div className="grid grid-cols-2">
        <div className="py-5 px-4 text-xl md:px-16">
          <h2 className="mb-2 text-3xl font-bold">User info</h2>
          <div className="flex gap-2">
            <img
              src={order_user.avatar}
              alt={`Avatar of ${order_user.username}`}
              className="h-28 w-28"
            />
            <div>
              <p className="font-bold">
                {order_user.username} ({order_user.id})
              </p>
              <p>{order_user.email}</p>
              <p>
                <span className="font-semibold">Slack ID:</span>{" "}
                {order_user.slack_id}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">Address</h3>
            <p>{order_user.address_street}</p>
            <p>
              {order_user.address_locality}, {order_user.address_region}{" "}
              {order_user.address_postal}
            </p>
            <p>{order_user.address_country}</p>
          </div>
        </div>

        <div className="py-5 px-4 text-xl md:px-16">
          <h2 className="mb-2 text-3xl font-bold">Item</h2>
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="mb-4 h-48 w-48 object-contain"
            />
          )}
          <p className="font-bold">{item.name}</p>
          <p className="text-lg text-gray-600">{item.description}</p>
        </div>
      </div>
    </Layout>
  );
}
