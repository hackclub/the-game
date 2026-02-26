import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { Order } from "@/interfaces/order";
import type { PrivateUser } from "@/interfaces/user";
import type { Item } from "@/interfaces/item";
import { router } from "@inertiajs/react";

interface Props {
  order: Order;
  order_user: PrivateUser;
  item: Item;
}

export default function ShowOrder({ order, order_user, item }: Props) {
  function handleDelete() {
    router.delete(`/shop/orders/${order.id}`);
  }
  function handleFulfill() {
    router.patch(`/shop/orders/${order.id}/fulfill`);
  }
  function handleOnHold() {
    router.patch(`/shop/orders/${order.id}/hold`);
  }

  return (
    <Layout>
      <PageHeading eyebrow="Orders" title={`Order #${order.id}`} />

      <div className="grid grid-cols-2">
        <div className="px-4 py-5 text-xl md:px-16">
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
          <p>
            <span className="font-semibold">Price:</span> {item.price} tickets
          </p>
          <p className="mt-4 flex items-center gap-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${
                {
                  pending: "bg-yellow-100 text-yellow-800",
                  processing: "bg-blue-100 text-blue-800",
                  fulfilled: "bg-green-100 text-green-800",
                  hold: "bg-orange-100 text-orange-800",
                }[order.aasm_state] ?? "bg-gray-100 text-gray-800"
              }`}
            >
              {order.aasm_state}
            </span>
          </p>
          <div className="mt-4">
            <div className="grid grid-rows-2">
              <p>
              <span className="font-semibold"> Created on:  </span> {order.created_at}
              </p>
              <p>
              {order.fulfilled_at &&
        <h2>
          You have {order.fulfilled_at} unread messages.
        </h2>
      }
            </p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">Mark Progress</h3>
            <div className="flex gap-2">
              <button
                className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white"
                onClick={handleFulfill}
              >
                Fulfilled
              </button>
              <button
                className="cursor-pointer rounded-md bg-orange-500 px-4 py-2 font-bold text-white"
                onClick={handleOnHold}
              >
                Place On Hold
              </button>
              <button
                className="cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>


        <div className="px-4 py-5 text-xl md:px-16">
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
                <span className="font-semibold">Balance:</span>{" "}
                {order_user.balance} tickets
              </p>
              <p>
                <span className="font-semibold">Slack ID:</span>{" "}
                {order_user.slack_id}
              </p>
              <p>
                <span className="font-semibold">Hackatime ID:</span>{" "}
                {order_user.hackatime_id} (
                <a
                  href={`https://joe.fraud.hackclub.com/profile/${order_user.hackatime_id}`}
                  className="text-blue-500 underline"
                >
                  Joe
                </a>{" "}
                |{" "}
                <a
                  href={`https://billy.3kh0.net/?u=${order_user.hackatime_id}`}
                  className="text-blue-500 underline"
                >
                  Billy
                </a>
                )
              </p>
              <p>
                <span className="font-semibold">Verification:</span>{" "}
                {order_user.verification_status}
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
      </div>
    </Layout>
  );
}
