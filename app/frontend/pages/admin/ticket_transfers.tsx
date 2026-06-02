import Layout from "@/layouts/layout";
import { TicketTransfer } from "@/interfaces/ticket_transfer";
import { PublicUser } from "@/interfaces/user";
import { Pagination } from "@/interfaces/pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  transfers: TicketTransfer[];
  status: string;
  users: PublicUser[];
  pagination: Pagination;
}

export default function Orders({
  transfers,
  status,
  pagination,
  users,
}: Props) {
  const [newStatus, setNewStatus] = useState(status || "");

  const [colDefs] = useState([
    {
      field: "id" as const,
      headerName: "Transfer ID",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/ticket_transfers/${field.value}`}
          >
            {field.value}
          </a>
        );
      },
    },
    {
      field: "from_user_id" as const,
      headerName: "From User",
      cellRenderer: (field: any) => {
        return (
          <a className="text-blue-500 underline" href={`/admin/users/${field.value}`}>
            {users.find((u) => u.id == field.value)?.username}
          </a>
        );
      },
    },
    {
      field: "to_user_id" as const,
      headerName: "To User",
      cellRenderer: (field: any) => {
        return (
          <a className="text-blue-500 underline" href={`/admin/users/${field.value}`}>
            {users.find((u) => u.id == field.value)?.username}
          </a>
        );
      },
    },
    {
      field: "aasm_state" as const,
      headerName: "Status",
    },
  ]);

  function goToPage(page: number) {
    router.get(
      "/admin/ticket_transfers",
      { page, status },
      { preserveScroll: true },
    );
  }

  function search() {
    router.get(
      "/admin/ticket_transfers",
      { status: newStatus },
      { preserveScroll: true },
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Ticket Transfers</h1>

      <div className="my-6 flex gap-3">
        {["pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            className={`cursor-pointer rounded-full border px-3 py-2 ${newStatus === s ? "bg-blue-300" : "bg-white"}`}
            onClick={() => {
              setNewStatus((currentStatus) => {
                if (currentStatus === s) {
                  return "";
                } else {
                  return s;
                }
              });
            }}
          >
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}

        <button
          className="cursor-pointer rounded-md border bg-white px-3 py-2"
          onClick={search}
        >
          Apply
        </button>
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={transfers}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
          enableCellTextSelection={true}
        />
      </div>

      <div className="mt-4 flex gap-2">
        {pagination.prev_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.prev_page)}
          >
            ← Prev
          </button>
        )}

        <span>
          Page {pagination.current_page} of {pagination.total_pages}
        </span>

        {pagination.next_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.next_page)}
          >
            Next →
          </button>
        )}
      </div>
    </Layout>
  );
}
