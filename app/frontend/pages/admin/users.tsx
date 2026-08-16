import Layout from "@/layouts/layout";
import { PrivateUser } from "@/interfaces/user";
import { Pagination } from "@/interfaces/pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  users: PrivateUser[];
  slack_ids: string[];
  q: string;
  permission: string;
  negative_balance: boolean;
  per_page: number;
  pagination: Pagination;
}

export default function Users({
  users,
  slack_ids,
  q,
  permission,
  negative_balance,
  per_page,
  pagination,
}: Props) {
  const [newQuery, setNewQuery] = useState(q || "");
  const [newPermission, setNewPermission] = useState(permission || "");
  const [newNegativeBalance, setNewNegativeBalance] = useState(
    negative_balance || false,
  );
  const [perPage, setPerPage] = useState(per_page || 25);
  const [goToPageInput, setGoToPageInput] = useState(
    String(pagination.current_page),
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastServerQuery = useRef(q || "");

  useEffect(() => {
    lastServerQuery.current = q || "";
    setGoToPageInput(String(pagination.current_page));
  }, [q, pagination.current_page]);

  function navigateWithFilters(overrides: Record<string, any> = {}) {
    const params: Record<string, any> = {
      q: newQuery,
      permission: newPermission,
      negative_balance: newNegativeBalance,
      per_page: perPage,
      ...overrides,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === false) {
        delete params[key];
      }
    });

    lastServerQuery.current = params.q || "";
    router.get("/admin/users", params, {
      preserveScroll: true,
      preserveState: true,
    });
  }

  useEffect(() => {
    if (newQuery === lastServerQuery.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      navigateWithFilters();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newQuery]);

  // Immediate refresh on permission filter change
  const handlePermissionToggle = (p: string) => {
    const nextPermission = newPermission === p ? "" : p;
    setNewPermission(nextPermission);
    navigateWithFilters({ permission: nextPermission });
  };

  const handleNegativeBalanceToggle = () => {
    const next = !newNegativeBalance;
    setNewNegativeBalance(next);
    navigateWithFilters({ negative_balance: next });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    navigateWithFilters({ per_page: value, page: 1 });
  };

  function goToPage(page: number) {
    if (page < 1 || page > pagination.total_pages) return;
    navigateWithFilters({ page });
  }

  function handleGoToPage() {
    const page = parseInt(goToPageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= pagination.total_pages) {
      goToPage(page);
    }
  }

  const [colDefs] = useState([
    {
      field: "id" as const,
      headerName: "ID",
      width: 80,
      cellRenderer: (field: any) => {
        return (
          <a
            href={`/admin/users/${field.value}`}
            className="text-blue-500 underline"
          >
            {field.value}
          </a>
        );
      },
    },
    {
      field: "avatar" as const,
      headerName: "Avatar",
      width: 70,
      cellRenderer: (field: any) => {
        if (!field.value) return null;
        return (
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={field.value}
            alt=""
          />
        );
      },
      sortable: false,
      filter: false,
    },
    { field: "username" as const },
    { field: "email" as const },
    {
      headerName: "Permissions",
      width: 130,
      valueGetter: (params: any) => {
        const flags = [];
        if (params.data.is_admin) flags.push("Admin");
        if (params.data.is_reviewer) flags.push("Reviewer");
        if (params.data.is_fulfiller) flags.push("Fulfiller");
        if (params.data.is_debt) flags.push("Debt");
        return flags.join(", ") || "User";
      },
    },
    {
      field: "ysws_verified" as const,
      headerName: "YSWS Verified?",
      width: 120,
    },
    { field: "slack_id" as const, headerName: "Slack ID", width: 110 },
    { field: "account_id" as const, headerName: "HCA ID", width: 100 },
    { field: "hackatime_id" as const, headerName: "Hackatime ID", width: 120 },
    { field: "project_count" as const, headerName: "Projects", width: 90 },
    {
      field: "balance" as const,
      headerName: "Balance",
      width: 90,
      valueFormatter: (field: any) => `${field.value}`,
    },
    {
      field: "total_reported_seconds" as const,
      headerName: "Reported Hrs",
      width: 120,
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "total_approved_seconds" as const,
      headerName: "Approved Hrs",
      width: 120,
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      headerName: "Actions",
      width: 110,
      cellRenderer: (field: any) => {
        return (
          <button
            className="cursor-pointer rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            onClick={() =>
              router.post(`/admin/users/${field.data.id}/sync_to_platform`)
            }
          >
            Sync to IRL
          </button>
        );
      },
    },
  ]);

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Users</h1>

      <div className="my-6 flex flex-wrap items-center gap-3">
        <input
          className="w-full rounded-md px-3 py-1 md:w-1/3"
          placeholder="Search by name, email, ID, or Slack ID..."
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
        />

        {["admin", "reviewer", "fulfiller", "debt"].map((p) => (
          <button
            key={p}
            className={`cursor-pointer rounded-full border px-3 py-2 ${newPermission === p ? "bg-blue-300" : "bg-white"}`}
            onClick={() => handlePermissionToggle(p)}
          >
            {p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}

        <button
          className={`cursor-pointer rounded-full border px-3 py-2 ${newNegativeBalance ? "bg-blue-300" : "bg-white"}`}
          onClick={handleNegativeBalanceToggle}
        >
          Negative Balance
        </button>
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={users}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
          enableCellTextSelection={true}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {pagination.prev_page && (
          <button
            className="cursor-pointer"
            onClick={() => goToPage(pagination.prev_page)}
          >
            &larr; Prev
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
            Next &rarr;
          </button>
        )}

        <span className="ml-4 text-sm text-gray-600">
          ({pagination.total_count} total)
        </span>

        <div className="ml-4 flex items-center gap-1">
          <label className="text-sm">Go to:</label>
          <input
            className="w-16 rounded border px-2 py-1 text-sm"
            type="number"
            min={1}
            max={pagination.total_pages}
            value={goToPageInput}
            onChange={(e) => setGoToPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGoToPage();
            }}
          />
          <button
            className="cursor-pointer rounded border bg-white px-2 py-1 text-sm"
            onClick={handleGoToPage}
          >
            Go
          </button>
        </div>

        <div className="ml-4 flex items-center gap-1">
          <label className="text-sm">Per page:</label>
          <select
            className="rounded border px-2 py-1 text-sm"
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {slack_ids.length > 0 && (
        <div className="mt-6">
          <label className="text-sm font-medium">
            Slack IDs ({slack_ids.length}, all matching filters):
          </label>
          <textarea
            readOnly
            className="mt-1 h-32 w-full rounded border px-2 py-1 font-mono text-sm"
            value={slack_ids.join(", ")}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}
    </Layout>
  );
}
