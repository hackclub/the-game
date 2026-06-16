import Layout from "@/layouts/layout";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface BudgetItem {
  id: number;
  name: string;
  price: number;
  real_price: number | null;
  category: string | null;
}

interface BudgetOrder {
  id: number;
  item_id: number;
  item_name: string;
  user_id: number;
  username: string;
  quantity: number;
  amount_paid: number;
  aasm_state: string;
  created_at: string;
}

interface Props {
  items: BudgetItem[];
  orders: BudgetOrder[];
  total_user_balance_tickets: number;
}

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="flex min-w-48 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <span className="text-3xl font-bold tabular-nums">{value}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {sublabel && (
        <span className="text-xs text-gray-400">{sublabel}</span>
      )}
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default function Budget({
  items: initialItems,
  orders,
  total_user_balance_tickets,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [ticketRate, setTicketRate] = useState(8.5);
  const itemGridRef = useRef<AgGridReact>(null);
  const orderGridRef = useRef<AgGridReact>(null);

  const itemsById = Object.fromEntries(items.map((i) => [i.id, i]));

  const totalShopRealPrice = orders.reduce((sum, o) => {
    const item = itemsById[o.item_id];
    const rp = item?.real_price ?? 0;
    return sum + rp * o.quantity;
  }, 0);

  const totalUserBalanceDollars = total_user_balance_tickets * ticketRate;

  const combinedTotal = totalShopRealPrice + totalUserBalanceDollars;

  const saveRealPrice = useCallback(
    async (itemId: number, realPrice: number | null) => {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      await fetch(`/admin/budget/items/${itemId}/real_price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ real_price: realPrice }),
      });

      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, real_price: realPrice } : i,
        ),
      );
    },
    [],
  );

  const [itemColDefs] = useState([
    { field: "id" as const, headerName: "ID", width: 70 },
    { field: "name" as const, flex: 2 },
    { field: "category" as const, width: 120 },
    {
      field: "price" as const,
      headerName: "Tickets",
      width: 100,
    },
    {
      headerName: "WG Unit Price",
      width: 140,
      valueGetter: (params: any) => params.data.price * ticketRate,
      valueFormatter: (params: any) => fmt(params.value),
    },
    {
      field: "real_price" as const,
      headerName: "Real Price ($)",
      width: 140,
      editable: true,
      valueFormatter: (params: any) =>
        params.value != null ? fmt(params.value) : "—",
      valueSetter: (params: any) => {
        const raw = params.newValue;
        const parsed = raw === "" || raw == null ? null : parseFloat(raw);
        if (parsed !== null && isNaN(parsed)) return false;
        params.data.real_price = parsed;
        saveRealPrice(params.data.id, parsed);
        return true;
      },
    },
  ]);

  const [orderColDefs] = useState([
    { field: "id" as const, headerName: "ID", width: 70 },
    {
      field: "item_name" as const,
      headerName: "Item",
      flex: 2,
    },
    {
      field: "username" as const,
      headerName: "User",
      flex: 1,
      cellRenderer: (params: any) => (
        <a
          className="text-blue-500 underline"
          href={`/admin/users/${params.data.user_id}`}
        >
          {params.value}
        </a>
      ),
    },
    { field: "quantity" as const, width: 80 },
    {
      field: "amount_paid" as const,
      headerName: "Tickets Paid",
      width: 120,
    },
    {
      headerName: "Real Cost",
      width: 120,
      valueGetter: (params: any) => {
        const item = itemsById[params.data.item_id];
        const rp = item?.real_price ?? 0;
        return rp * params.data.quantity;
      },
      valueFormatter: (params: any) =>
        params.value > 0 ? fmt(params.value) : "—",
    },
    {
      field: "aasm_state" as const,
      headerName: "Status",
      width: 110,
      cellRenderer: (params: any) => {
        const colors: Record<string, string> = {
          pending: "bg-yellow-100 text-yellow-800",
          fulfilled: "bg-green-100 text-green-800",
          hold: "bg-orange-100 text-orange-800",
        };
        return (
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[params.value] || "bg-gray-100 text-gray-800"}`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "created_at" as const,
      headerName: "Date",
      width: 130,
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString(),
    },
  ]);

  return (
    <Layout>
      <div className="px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Budget Overview</h1>
          <p className="text-gray-500 italic">
            Shop costs, user balances, and total projected spend
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-sm font-medium text-gray-700">
            Ticket-to-dollar rate
          </label>
          <span className="text-sm text-gray-400">$</span>
          <input
            type="number"
            step="0.01"
            value={ticketRate}
            onChange={(e) =>
              setTicketRate(parseFloat(e.target.value) || 0)
            }
            className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-sm text-gray-400">per ticket</span>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <StatCard
            label="Total Shop Orders (Real Price)"
            value={fmt(totalShopRealPrice)}
            sublabel={`Across ${orders.length} orders`}
          />
          <StatCard
            label="Total Remaining Balances"
            value={fmt(totalUserBalanceDollars)}
            sublabel={`${total_user_balance_tickets.toLocaleString()} tickets @ ${fmt(ticketRate)}/ticket`}
          />
          <StatCard
            label="Combined Total"
            value={fmt(combinedTotal)}
            sublabel="Shop orders + remaining balances"
          />
        </div>

        <h2 className="mb-3 text-xl font-bold">Shop Items</h2>
        <p className="mb-2 text-sm text-gray-500">
          Double-click a Real Price cell to edit. Changes save automatically.
        </p>
        <div style={{ height: 400 }} className="mb-8">
          <AgGridReact
            ref={itemGridRef}
            rowData={items}
            columnDefs={itemColDefs}
            loadThemeGoogleFonts={true}
            enableCellTextSelection={true}
            singleClickEdit={true}
          />
        </div>

        <h2 className="mb-3 text-xl font-bold">Shop Orders</h2>
        <div style={{ height: 500 }}>
          <AgGridReact
            ref={orderGridRef}
            rowData={orders}
            columnDefs={orderColDefs}
            loadThemeGoogleFonts={true}
            enableCellTextSelection={true}
          />
        </div>
      </div>
    </Layout>
  );
}
