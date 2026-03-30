import Layout from "@/layouts/layout";
import { Order } from "@/interfaces/order";
import { PublicUser } from "@/interfaces/user";
import { Item } from "@/interfaces/item";
import { Pagination } from "@/interfaces/pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  orders: Order[];
  status: string;
  item_id: number;
  items: Item[];
  user_id: number;
  users: PublicUser[];
  pagination: Pagination;
}

export default function Orders({
  orders,
  status,
  pagination,
  item_id,
  items,
  user_id,
  users,
}: Props) {
  const [newStatus, setNewStatus] = useState(status || "");
  const [newItemId, setNewItemId] = useState(item_id || "");
  const [newUserId, setNewUserId] = useState(user_id || "");

  const [colDefs] = useState([
    {
      field: "id" as const,
      headerName: "Order ID",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/shop/orders/${field.value}`}
          >
            {field.value}
          </a>
        );
      },
    },
    {
      field: "user_id" as const,
      headerName: "User",
      cellRenderer: (field: any) => {
        return (
          <a className="text-blue-500 underline" href={`/users/${field.value}`}>
            {users.find((u) => u.id == field.value)?.username}
          </a>
        );
      },
    },
    {
      field: "item_id" as const,
      headerName: "Item",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/admin/items/${field.value}`}
          >
            {items.find((i) => i.id == field.value)?.name}
          </a>
        );
      },
    },
    {
      field: "quantity" as const,
      headerName: "Quantity",
    },
    {
      field: "aasm_state" as const,
      headerName: "Status",
    },
  ]);

  function goToPage(page: number) {
    router.get(
      "/admin/orders",
      { page, status, item_id, user_id },
      { preserveScroll: true },
    );
  }

  function search() {
    router.get(
      "/admin/orders",
      { status: newStatus, item_id: newItemId, user_id: newUserId },
      { preserveScroll: true },
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="my-6 flex gap-3">
        {["pending", "fulfilled", "hold"].map((s) => (
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

        <select
          className="ml-4 rounded-md border border-black"
          onChange={(e) => {
            setNewItemId(e.target.value);
          }}
        >
          <option value="">All items</option>
          {items.map((i) => (
            <option
              value={i.id}
              className={`cursor-pointer rounded-full border px-3 py-2 ${newItemId === i.id ? "bg-blue-300" : "bg-white"}`}
              selected={i.id == item_id}
            >
              {i.name}
            </option>
          ))}
        </select>

        <select
          className="mx-4 rounded-md border border-black"
          onChange={(e) => {
            setNewUserId(e.target.value);
          }}
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option
              value={u.id}
              className={`cursor-pointer rounded-full border px-3 py-2 ${newUserId === u.id ? "bg-blue-300" : "bg-white"}`}
              selected={u.id == user_id}
            >
              {u.username || u.id}
            </option>
          ))}
        </select>

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
