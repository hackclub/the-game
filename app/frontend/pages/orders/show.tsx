import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { Order } from "@/interfaces/order";
import type { PrivateUser } from "@/interfaces/user";
import type { Item } from "@/interfaces/item";
import { router } from "@inertiajs/react";
import { useState } from "react";

interface Props {
  order: Order;
  order_user: PrivateUser;
  item: Item;
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{label}</h3>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}

export default function ShowOrder({ order, order_user, item }: Props) {
  const [adminNote, setAdminNote] = useState(order.admin_note ?? "");
  const [userNote, setUserNote] = useState((order as any).user_note ?? "");

  const state = order.deleted_at ? "deleted" : order.aasm_state;
  const canAct = !order.deleted_at && order.aasm_state !== "fulfilled";

  return (
    <Layout>
      <PageHeading
        eyebrow="Orders"
        title={`Order #${order.id}: ${item.name}`}
      />

      <div className="mt-6 flex flex-col gap-6 px-4 pb-10 md:px-16">

        <Section title="Order details">
          <div className="flex flex-col gap-5 md:flex-row md:gap-8">
            <div className="flex flex-1 flex-col gap-4">
              <Field label={item.name}>
                <p className="text-gray-500">{item.description}</p>
              </Field>

              <Field label="User">
                <a href={`/admin/users/${order_user.id}`} className="underline">
                  {order_user.username}
                </a>
                {order_user.slack_id && (
                  <p>
                    Slack:{" "}
                    <a
                      href={`https://hackclub.enterprise.slack.com/team/${order_user.slack_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {order_user.slack_id}
                    </a>
                  </p>
                )}
              </Field>

              <Field label="Payment">
                <p>
                  {order.amount_paid} tickets
                  {order.quantity > 1 && ` (${item.price} each × ${order.quantity})`}
                </p>
              </Field>

              <Field label="Status">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${STATUS_COLORS[state] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {STATUS_LABELS[state] ?? state}
                </span>
              </Field>

              <Field label="Email">
                <p>{order_user.email}</p>
              </Field>

              <Field label="Full name">
                <p>
                  {[order_user.first_name, order_user.last_name].filter(Boolean).join(" ") || "—"}
                </p>
              </Field>

              <Field label="Shipping address">
                {order_user.address_street ? (
                  <>
                    <p>{order_user.address_street}</p>
                    <p>
                      {[order_user.address_locality, order_user.address_region, order_user.address_postal]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p>{order_user.address_country}</p>
                  </>
                ) : (
                  <p className="text-gray-400">No address on file</p>
                )}
              </Field>

              {order.note && (
                <Field label="User note">
                  <p className="whitespace-pre-wrap">{order.note}</p>
                </Field>
              )}

              <Field label="Order date">
                <abbr title={new Date(order.created_at).toUTCString()}>
                  Created {relativeDate(order.created_at)}
                </abbr>
                {order.fulfilled_at && (
                  <p className="text-sm text-gray-500">
                    Fulfilled {relativeDate(order.fulfilled_at)}
                  </p>
                )}
                {order.hold_at && (
                  <p className="text-sm text-gray-500">
                    Held {relativeDate(order.hold_at)}
                  </p>
                )}
              </Field>

              {order_user.balance < 0 && (
                <p className="rounded-md border-2 border-yellow-400 bg-yellow-100 p-3 font-bold text-yellow-800">
                  ⚠ User has a negative balance — an approval may have been undone.
                </p>
              )}
              {order_user.can_overspend && (
                <p className="rounded-md border-2 border-blue-400 bg-blue-100 p-3 font-bold text-blue-800">
                  This user has overspending enabled for event items.
                </p>
              )}
            </div>

            {item.image && (
              <div className="shrink-0 md:w-72">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full rounded-xl object-contain"
                />
              </div>
            )}
          </div>
        </Section>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-2xl font-bold">Admin notes</h2>
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-sm text-gray-500">
                  e.g. tracking number — visible to orgs only
                </span>
                <textarea
                  className="flex-1 rounded-xl border-2 border-black p-3"
                  rows={4}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </label>
              <button
                className="cursor-pointer rounded-xl border-2 border-black bg-black px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
                onClick={() =>
                  router.patch(`/shop/orders/${order.id}`, { admin_note: adminNote })
                }
              >
                Update notes
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-2xl font-bold">User notes</h2>
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-sm text-gray-500">
                  Sent to the user via Slack when the order is fulfilled
                </span>
                <textarea
                  className="flex-1 rounded-xl border-2 border-black p-3"
                  rows={4}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                />
              </label>
              <button
                className="cursor-pointer rounded-xl border-2 border-black bg-black px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
                onClick={() =>
                  router.patch(`/shop/orders/${order.id}`, { user_note: userNote })
                }
              >
                Save note
              </button>
            </div>
          </div>
        </div>

        <Section title="Actions">
          {canAct ? (
            <div className="flex flex-col gap-3">
              {order.aasm_state !== "fulfilled" && (
                <button
                  className="cursor-pointer rounded-xl border-2 border-black bg-green-500 px-4 py-3 font-bold text-white transition-colors hover:bg-green-600"
                  onClick={() => router.patch(`/shop/orders/${order.id}/fulfill`)}
                >
                  Mark as fulfilled
                </button>
              )}
              {order.aasm_state !== "hold" && (
                <button
                  className="cursor-pointer rounded-xl border-2 border-black bg-orange-500 px-4 py-3 font-bold text-white transition-colors hover:bg-orange-600"
                  onClick={() => router.patch(`/shop/orders/${order.id}/hold`)}
                >
                  Place on hold
                </button>
              )}
              <button
                className="cursor-pointer rounded-xl border-2 border-black bg-red-500 px-4 py-3 font-bold text-white transition-colors hover:bg-red-600"
                onClick={() => {
                  if (confirm("Refund this order?")) router.delete(`/shop/orders/${order.id}`);
                }}
              >
                Refund order
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Order is {STATUS_LABELS[state]?.toLowerCase() ?? state} — no actions available.
            </p>
          )}
        </Section>

      </div>
    </Layout>
  );
}
