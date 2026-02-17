import Layout from "@/layouts/layout";
import { PrivateUser } from "@/interfaces/user";
import { Pagination } from "@/interfaces/pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  users: PrivateUser[];
  q: string;
  role: string;
  pagination: Pagination;
}

export default function Users({ users, q, role, pagination }: Props) {
  const [newQuery, setNewQuery] = useState(q || "");
  const [newRole, setNewRole] = useState(role || "");

  const [rowData, setRowData] = useState(users);
  const [colDefs, setColDefs] = useState([
    {
      field: "id" as const,
      headerName: "ID",
    },
    {
      field: "avatar" as const,
      headerName: "Avatar",
      cellRenderer: (field: any) => {
        return (
          <img className="h-10 w-10 rounded-md" src={field.value} alt="-" />
        );
      },
    },
    { field: "username" as const },
    { field: "email" as const },
    { field: "role" as const },
    { field: "ysws_verified" as const, headerName: "YSWS Verified?" },
    { field: "slack_id" as const, headerName: "Slack ID" },
    { field: "account_id" as const, headerName: "HCA ID" },
    { field: "hackatime_id" as const, headerName: "Hackatime ID" },
  ]);

  function goToPage(page: number) {
    router.get("/admin/users", { page, q, role }, { preserveScroll: true });
  }

  function search() {
    router.get(
      "/admin/users",
      { q: newQuery, role: newRole },
      { preserveScroll: true },
    );
  }

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Users</h1>

      <div className="my-6 flex gap-3">
        <input
          className="w-full rounded-md px-3 py-1 md:w-1/3"
          placeholder="Search users..."
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
        />

        {["user", "admin"].map((r) => (
          <button
            className={`cursor-pointer rounded-full border px-3 py-2 ${newRole === r ? "bg-blue-300" : "bg-white"}`}
            onClick={() => {
              setNewRole((currentRole) => {
                if (currentRole === r) {
                  return "";
                } else {
                  return r;
                }
              });
            }}
          >
            {r[0].toUpperCase() + r.slice(1)}
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
          rowData={rowData}
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
