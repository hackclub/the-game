import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { TicketTransfer } from "@/interfaces/ticket_transfer";
import type { PrivateUser } from "@/interfaces/user";
import { router } from "@inertiajs/react";

interface Props {
  transfer: TicketTransfer;
  from_user: PrivateUser;
  to_user: PrivateUser;
}

export default function ShowTransfer({ transfer, from_user, to_user }: Props) {
  function handleDelete() {
    router.delete(`/ticket_transfers/${transfer.id}`);
  }
  function handleApprove() {
    router.patch(`/ticket_transfers/${transfer.id}/approve`);
  }
  function handleReject() {
    router.patch(`/ticket_transfers/${transfer.id}/reject`);
  }

  return (
    <Layout>
      <PageHeading eyebrow="Transfers" title={`Transfer #${transfer.id}`} />

      <p className="px-4 py-5 text-xl md:px-16">
        <a className="text-blue-500 underline" href={`/users/${from_user.id}`}>
          {from_user.username}
        </a>{" "}
        has requested to transfer{" "}
        <span>
          {transfer.amount} ticket{transfer.amount != 1 && "s"}
        </span>{" "}
        to{" "}
        <a className="text-blue-500 underline" href={`/users/${to_user.id}`}>
          {to_user.username}
        </a>
      </p>

      <div className="grid grid-cols-2">
        <div className="px-4 py-5 text-xl md:px-16">
          <p className="mt-4 flex items-center gap-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${
                {
                  pending: "bg-yellow-100 text-yellow-800",
                  approved: "bg-green-100 text-green-800",
                  rejected: "bg-orange-100 text-orange-800",
                }[transfer.aasm_state] ?? "bg-gray-100 text-gray-800"
              }`}
            >
              {transfer.aasm_state}
            </span>
          </p>
          <div className="mt-4">
            <div className="grid grid-rows-2">
              <p>
                <span className="font-semibold"> Created on: </span>{" "}
                {new Date(transfer.created_at).toLocaleString()}
              </p>

              {transfer.approved_at && (
                <p>
                  <span className="font-semibold"> Approved at: </span>{" "}
                  {new Date(transfer.approved_at).toLocaleString()}
                </p>
              )}

              {transfer.rejected_at && (
                <p>
                  <span className="font-semibold"> Rejected at: </span>{" "}
                  {new Date(transfer.rejected_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-bold">Mark Progress</h3>
            {from_user.balance < 0 && (
              <p className="my-2 rounded-md border-2 border-yellow-400 bg-yellow-200 p-4 font-bold">
                WARNING: THE SENDING USER ({from_user.username}) HAS A NEGATIVE
                BALANCE. AN APPROVAL WAS PROBABLY UNDONE.
              </p>
            )}
            {to_user.balance < 0 && (
              <p className="my-2 rounded-md border-2 border-yellow-400 bg-yellow-200 p-4 font-bold">
                WARNING: THE RECEIVING USER ({to_user.username}) HAS A NEGATIVE
                BALANCE. AN APPROVAL WAS PROBABLY UNDONE.
              </p>
            )}
            <div className="flex gap-2">
              <button
                className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="cursor-pointer rounded-md bg-orange-500 px-4 py-2 font-bold text-white"
                onClick={handleReject}
              >
                Reject
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
      </div>
    </Layout>
  );
}
