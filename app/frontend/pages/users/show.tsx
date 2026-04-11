import { Link, usePage } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import MissingAccountFields from "@/components/settings/MissingAccountFields";
import { ACCOUNT_REQUIRED_FIELDS, PrivateUser } from "@/interfaces/user";
import PageHeading from "@/components/layout/PageHeading";
import AdjustmentForm from "@/components/adjustments/AdjustmentForm";
import inviteIcon from "@/assets/icons/invite.svg";
import type { Order } from "@/interfaces/order";
import type { Item } from "@/interfaces/item";
import OrderCard from "@/components/orders/Order";

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

export default function UserPage() {
  const { props } = usePage<Props>();
  const missingFields = ACCOUNT_REQUIRED_FIELDS.filter(
    (f) => !props.page_user[f as keyof PrivateUser],
  );

  return (
    <Layout>
      <PageHeading
        title={props.custom ? props.page_user.username : "Settings"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="smoothing-black flex flex-col gap-4 p-8 text-xl">
          {props.page_user.role === "admin" && (
            <p>
              {props.custom ? `${props.page_user.username} is ` : "You are"} an
              admin.
            </p>
          )}
          {props.page_user.role === "reviewer" && (
            <p>
              {props.custom ? `${props.page_user.username} is ` : "You are"} a
              reviewer.
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
              <Link
                className={`${props.page_user.account_id ? "text-yellow-600" : "text-red-500"} underline`}
                href="/auth/hca"
              >
                {props.page_user.account_id
                  ? "Reauthenticate"
                  : "Click here to link"}
              </Link>
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
              props.user.role === "admin") && (
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
                    {props.user.role === "admin" && (
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
            {props.user.role === "admin" && (
              <AdjustmentForm user_id={props.page_user.id} />
            )}
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
