import { Link, usePage, router } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import { ACCOUNT_REQUIRED_FIELDS, PrivateUser } from "@/interfaces/user";
import PageHeading from "@/components/layout/PageHeading";
import AdjustmentForm from "@/components/adjustments/AdjustmentForm";
import TransferForm from "@/components/transfers/TransferForm";
import inviteIcon from "@/assets/icons/invite.svg";
import type { Order } from "@/interfaces/order";
import type { Item } from "@/interfaces/item";
import OrderCard from "@/components/orders/Order";
import { useState } from "react";

interface Props {
  page_user: PrivateUser;
  custom: boolean;
  timeline: {
    name: string;
    date: string;
    link?: string;
  }[];
  orders: (Order & { item: Item })[];
  [_: string]: unknown;
}

const PERMISSIONS = ["is_admin", "is_reviewer", "is_fulfiller"] as const;
const PERMISSION_LABELS: Record<string, string> = {
  is_admin: "Admin",
  is_reviewer: "Reviewer",
  is_fulfiller: "Fulfiller",
};

export default function UserPage() {
  const { props } = usePage<Props>();
  const missingFields = ACCOUNT_REQUIRED_FIELDS.filter(
    (f) => !props.page_user[f as keyof PrivateUser],
  );
  const [permissions, setPermissions] = useState({
    is_admin: props.page_user.is_admin,
    is_reviewer: props.page_user.is_reviewer,
    is_fulfiller: props.page_user.is_fulfiller,
  });

  const permissionsChanged =
    permissions.is_admin !== props.page_user.is_admin ||
    permissions.is_reviewer !== props.page_user.is_reviewer ||
    permissions.is_fulfiller !== props.page_user.is_fulfiller;

  function updatePermissions() {
    router.patch(`/admin/users/${props.page_user.id}/permissions`, {
      is_admin: String(permissions.is_admin),
      is_reviewer: String(permissions.is_reviewer),
      is_fulfiller: String(permissions.is_fulfiller),
    });
  }

  return (
    <Layout>
      <PageHeading
        title={props.custom ? props.page_user.username : "Settings"}
      />

      {props.custom && (
        <div className="px-8 pt-4">
          <a
            href={`/users/${props.page_user.id}`}
            className="inline-block rounded-xl border-2 border-black bg-white px-4 py-3 text-lg font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02]"
          >
            View Public Profile
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="smoothing-black flex flex-col gap-4 p-8 text-xl">
          {!props.custom &&
            (props.page_user.is_admin ||
              props.page_user.is_reviewer ||
              props.page_user.is_fulfiller) && (
              <p>
                You are{" "}
                {[
                  props.page_user.is_admin && "an admin",
                  props.page_user.is_reviewer && "a reviewer",
                  props.page_user.is_fulfiller && "a fulfiller",
                ]
                  .filter(Boolean)
                  .join(", ")}
                .
              </p>
            )}
          {props.custom && props.user.is_admin && (
            <div className="flex flex-col gap-2">
              <p className="text-base font-bold">Permissions</p>
              <div className="flex items-center gap-4">
                {PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={permissions[perm]}
                      onChange={(e) =>
                        setPermissions((prev) => ({
                          ...prev,
                          [perm]: e.target.checked,
                        }))
                      }
                    />
                    {PERMISSION_LABELS[perm]}
                  </label>
                ))}
              </div>
              <button
                className="w-fit cursor-pointer rounded-md bg-black px-3 py-1 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
                onClick={updatePermissions}
                disabled={!permissionsChanged}
              >
                Save permissions
              </button>
            </div>
          )}
          {props.page_user.can_overspend && (
            <p className="rounded-md border-2 border-blue-400 bg-blue-100 px-4 py-2 font-bold text-blue-800">
              Overspending for event items is enabled for this user.
            </p>
          )}
          <p>
            <span className="font-bold">Email: </span>
            {props.page_user.email}
          </p>
          <p>
            <span className="font-bold">Ticket balance: </span>
            {props.page_user.balance}
          </p>
          <p>
            <span className="font-bold">Hours in review: </span>
            {(props.page_user.total_in_review_seconds / 3600).toFixed(1)}
          </p>
          <p>
            <span className="font-bold">Approved hours: </span>
            {(props.page_user.total_approved_seconds / 3600).toFixed(1)}
          </p>
          <p>
            <span className="font-bold">Hack Club Account:</span>{" "}
            {props.page_user.account_id && missingFields.length == 0 ? (
              <span className="text-green-600">Linked</span>
            ) : props.custom ? (
              <span>
                {props.page_user.account_id ? "Missing fields" : "Unlinked"}
              </span>
            ) : (
              <a
                className={`${props.page_user.account_id ? "text-yellow-600" : "text-red-500"} underline`}
                href="/auth/hca"
              >
                {props.page_user.account_id
                  ? "Reauthenticate"
                  : "Click here to link"}
              </a>
            )}
          </p>
          <MissingAccountFields />
          <p>
            <span className="font-bold">Hackatime:</span>{" "}
            {props.page_user.hackatime_id ? (
              <span className="text-green-600">Linked</span>
            ) : props.custom ? (
              <span>Unlinked</span>
            ) : (
              <Link className="text-red-500 underline" href="/hackatime/link">
                Click here to link
              </Link>
            )}
          </p>

          <div>
            {props.orders.length > 0 && (
              <>
                <p className="mb-2 text-2xl font-bold">Orders</p>
              </>
            )}

            {props.orders.map((order) => (
              <OrderCard order={order} />
            ))}
          </div>

          <div>
            {(props.page_user.ticket_adjustments.length > 0 ||
              props.user.is_admin) && (
              <>
                <p className="mb-2 text-2xl font-bold">Ticket adjustments</p>
              </>
            )}
            <div className="flex flex-col gap-3">
              {props.page_user.ticket_adjustments.map((adjustment) => (
                <div className="flex max-w-md flex-col rounded-md border bg-white p-4 text-lg">
                  <div className="flex justify-between">
                    <p>
                      <span
                        className={
                          adjustment.amount > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {adjustment.amount > 0 && "+"}
                        {adjustment.amount}
                      </span>{" "}
                      on {new Date(adjustment.created_at).toLocaleString()}
                    </p>
                    {props.user.is_admin && (
                      <Link
                        href={`/users/${props.user.id}/adjustments/${adjustment.id}`}
                        method="delete"
                        className="cursor-pointer text-red-500 underline"
                      >
                        Delete
                      </Link>
                    )}
                  </div>
                  <p>{adjustment.reason}</p>
                </div>
              ))}
            </div>
            {props.user.is_admin && (
              <AdjustmentForm user_id={props.page_user.id} />
            )}
          </div>

          <div>
            <p className="mb-2 text-2xl font-bold">Ticket transfers</p>
            <div className="flex flex-col gap-3">
              {[
                ...props.page_user.outgoing_ticket_transfers.filter(
                  (t) => t.aasm_state !== "rejected",
                ),
                ...props.page_user.incoming_ticket_transfers.filter(
                  (t) => t.aasm_state === "approved",
                ),
              ].map((transfer) => (
                <div className="flex max-w-md flex-col rounded-md border bg-white p-4 text-lg">
                  <div className="flex justify-between">
                    <p>
                      <strong>{transfer.from_user_name}</strong>{" "}
                      {transfer.aasm_state === "pending"
                        ? "requested to transfer"
                        : "transferred"}{" "}
                      {transfer.amount} ticket{transfer.amount === 1 ? "" : "s"}{" "}
                      to <strong>{transfer.to_user_name}</strong> on{" "}
                      {new Date(transfer.created_at).toLocaleString()}
                      <br />
                      <span className="italic">{transfer.reason}</span>
                    </p>
                    {props.user.is_admin && (
                      <Link
                        href={`/users/${props.user.id}/transfers/${transfer.id}`}
                        method="delete"
                        className="cursor-pointer text-red-500 underline"
                      >
                        Delete
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <TransferForm user_id={props.page_user.id} />
          </div>
        </div>
        <div className="p-8">
          <h2 className="mb-2 text-3xl font-bold">Timeline</h2>

          <div className="flex flex-col gap-4">
            {props.timeline.length === 0 && (
              <p className="text-lg">Ship projects to start earning tickets!</p>
            )}
            {props.timeline.map((item) => (
              <div className="rounded-md border bg-white p-4">
                <p>
                  {new Date(item.date).toLocaleString()}{" "}
                  {item.link && (
                    <a href={item.link}>
                      <img
                        className="inline h-5 w-5 pl-1 align-middle"
                        src={inviteIcon}
                      />
                    </a>
                  )}
                </p>
                <p className="text-lg font-bold">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
