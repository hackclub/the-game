import Layout from "@/layouts/layout";
import { Order } from "@/interfaces/order";
import { Pagination } from "@/interfaces/pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  orders: Order[];
  status: string;
  pagination: Pagination;
}

export default function Orders({ orders, status, pagination }: Props) {
  const [newStatus, setNewStatus] = useState(status || "");

  const [colDefs] = useState([
    {
      field: "id" as const,
      headerName: "Order ID",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/orders/${field.value}`}
          >
            {field.value}
          </a>
        );
      },
    },
    {
      field: "user_id" as const,
      headerName: "User ID",
    },
    {
      field: "item_id" as const,
      headerName: "Item ID",
    },
    {
      field: "aasm_state" as const,
      headerName: "Status",
    },
  ]);

  function goToPage(page: number) {
    router.get(
      "/admin/orders",
      { page, status: newStatus },
      { preserveScroll: true },
    );
  }

  function search() {
    router.get(
      "/admin/orders",
      { status: newStatus },
      { preserveScroll: true },
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="my-6 flex gap-3">
        {["pending", "processing", "fulfilled", "cancelled"].map((s) => (
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
          rowData={orders}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
        />
      </div>

      <div className="mt-4 flex gap-2">
        {pagination.prev_page && (
          <button onClick={() => goToPage(pagination.prev_page)}>← Prev</button>
        )}

        <span>
          Page {pagination.current_page} of {pagination.total_pages}
        </span>

        {pagination.next_page && (
          <button onClick={() => goToPage(pagination.next_page)}>Next →</button>
        )}
      </div>
    </Layout>
  );
}
