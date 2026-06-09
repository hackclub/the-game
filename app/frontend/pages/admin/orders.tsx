import Layout from "@/layouts/layout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import type { Order } from "@/interfaces/order";
import type { PublicUser } from "@/interfaces/user";
import type { Item } from "@/interfaces/item";
import type { Pagination } from "@/interfaces/pagination";
import { categoryBadgeClass } from "@/utils/categoryColor";

interface OrderWithDetails extends Order {
  username?: string;
  item?: Item;
}

interface Props {
  orders: OrderWithDetails[];
  status: string;
  item_id: number;
  items: Item[];
  user_id: number;
  users: PublicUser[];
  pagination: Pagination;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  fulfilled: "Fulfilled",
  hold: "On Hold",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  fulfilled: "bg-green-100 text-green-800",
  hold: "bg-orange-100 text-orange-800",
  deleted: "bg-red-100 text-red-800",
};

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 30) return new Date(dateStr).toLocaleDateString();
  if (days > 1) return `${days} days ago`;
  if (days === 1) return "yesterday";
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return "1 hour ago";
  if (minutes > 1) return `${minutes} minutes ago`;
  return "just now";
}

export default function Orders({
  orders,
  pagination,
  items,
  users,
  status,
  item_id,
  user_id,
}: Props) {
  const [newStatus, setNewStatus] = useState(status || "");
  const [newItemId, setNewItemId] = useState<number | "">(item_id || "");
  const [newUserId, setNewUserId] = useState<number | "">(user_id || "");
  const [itemSearch, setItemSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const filteredItems = items.filter((i) =>
    i.name?.toLowerCase().includes(itemSearch.toLowerCase()),
  );
  const filteredUsers = users.filter((u) =>
    (u.username || "").toLowerCase().includes(userSearch.toLowerCase()),
  );

  function search() {
    router.get(
      "/admin/orders",
      { status: newStatus, item_id: newItemId, user_id: newUserId },
      { preserveScroll: true },
    );
  }

  function goToPage(page: number) {
    router.get(
      "/admin/orders",
      { page, status, item_id, user_id },
      { preserveScroll: true },
    );
  }

  return (
    <Layout>
      <h1 className="mt-5 mb-3 text-3xl font-bold">Orders</h1>

      <div className="mb-6 rounded-2xl border-2 border-black bg-white p-4">
        <h2 className="mb-3 text-xl font-bold">Filter</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="font-medium">Status</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_LABELS).map(([s, label]) => (
                <button
                  key={s}
                  onClick={() => setNewStatus((cur) => (cur === s ? "" : s))}
                  className={`cursor-pointer rounded-full border-2 border-black px-3 py-1 text-sm font-semibold transition-colors ${newStatus === s ? "bg-black text-white" : "bg-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-medium">Item</span>
            <input
              type="text"
              placeholder="Search items..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              className="rounded-t-md border-2 border-b-0 border-black px-2 py-1 text-sm"
            />
            <select
              size={4}
              className="rounded-b-md border-2 border-black px-2 py-1 text-sm"
              value={newItemId}
              onChange={(e) =>
                setNewItemId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All items</option>
              {filteredItems.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-medium">User</span>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="rounded-t-md border-2 border-b-0 border-black px-2 py-1 text-sm"
            />
            <select
              size={4}
              className="rounded-b-md border-2 border-black px-2 py-1 text-sm"
              value={newUserId}
              onChange={(e) =>
                setNewUserId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All users</option>
              {filteredUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username || u.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={search}
          className="mt-4 w-full cursor-pointer rounded-xl border-2 border-black bg-black px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Apply
        </button>
      </div>

      <h2 className="mb-3 text-2xl font-bold">
        Orders{" "}
        <span className="ml-1 align-middle text-sm font-normal text-gray-500">
          ({pagination.total_count})
        </span>
      </h2>

      {orders.length === 0 ? (
        <p className="rounded-2xl border-2 border-black bg-white p-6 text-center text-gray-500">
          No orders found matching the filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => {
            const state = order.deleted_at ? "deleted" : order.aasm_state;
            return (
              <a
                key={order.id}
                href={`/shop/orders/${order.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-white transition-transform hover:scale-[1.02]"
              >
                {order.item?.image && (
                  <img
                    src={order.item.image}
                    alt={order.item.name}
                    className="aspect-[5/3] w-full bg-gray-100 object-contain"
                  />
                )}
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-1">
                      {order.item?.category && (
                        <span
                          className={`w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${categoryBadgeClass(order.item.category)}`}
                        >
                          {order.item.category}
                        </span>
                      )}
                      <h3 className="text-lg leading-tight font-bold">
                        {order.item?.name ?? "Unknown item"}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[state] ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {STATUS_LABELS[state] ?? state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      by{" "}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/admin/users/${order.user_id}`;
                        }}
                        className="underline hover:text-black"
                      >
                        {order.username ?? `User #${order.user_id}`}
                      </span>
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2 text-sm text-gray-500">
                    <span>{order.amount_paid} tickets</span>
                    <span title={new Date(order.created_at).toUTCString()}>
                      {relativeDate(order.created_at)}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        {pagination.prev_page && (
          <button
            className="cursor-pointer rounded-xl border-2 border-black px-4 py-2 font-semibold hover:bg-gray-100"
            onClick={() => goToPage(pagination.prev_page)}
          >
            ← Prev
          </button>
        )}
        <span className="text-sm text-gray-600">
          Page {pagination.current_page} of {pagination.total_pages}
        </span>
        {pagination.next_page && (
          <button
            className="cursor-pointer rounded-xl border-2 border-black px-4 py-2 font-semibold hover:bg-gray-100"
            onClick={() => goToPage(pagination.next_page)}
          >
            Next →
          </button>
        )}
      </div>
    </Layout>
  );
}
