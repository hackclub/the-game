import Layout from "@/layouts/layout";
import { Project } from "@/interfaces/project";
import { PublicUser } from "@/interfaces/user";
import { Pagination } from "@/interfaces/pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  projects: (Project & { user: PublicUser })[];
  pagination: Pagination;
}

export default function Projects({ projects, pagination }: Props) {
  const [rowData, setRowData] = useState(projects);
  const [colDefs, setColDefs] = useState([
    {
      field: "id" as const,
      headerName: "ID",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/projects/${field.value}`}
          >
            {field.value}
          </a>
        );
      },
    },
    { field: "user.id" as const, headerName: "User ID" },
    { field: "title" as const },
    {
      field: "aasm_state" as const,
      headerName: "Status",
    },
    {
      field: "total_seconds" as const,
      headerName: "Hours",
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "created_at" as const,
      headerName: "Created At",
      valueFormatter: (field: any) => new Date(field.value).toLocaleString(),
    },
  ]);

  function goToPage(page: number) {
    router.get("/admin/projects", { page }, { preserveScroll: true });
  }

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Projects</h1>
      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
        />
      </div>
      {/* Pagination */}
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
