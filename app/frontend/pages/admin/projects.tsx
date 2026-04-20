import Layout from "@/layouts/layout";
import { Project } from "@/interfaces/project";
import { PublicUser } from "@/interfaces/user";
import { Pagination } from "@/interfaces/pagination";
import { ProjectTag } from "@/interfaces/project_tag";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  projects: (Project & { user: PublicUser })[];
  q: string;
  status: string;
  high_quality: boolean;
  tag: string;
  available_tags: ProjectTag[];
  pagination: Pagination;
}

export default function Projects({
  projects,
  q,
  status,
  high_quality,
  tag,
  available_tags,
  pagination,
}: Props) {
  const [newQuery, setNewQuery] = useState(q || "");
  const [newStatus, setNewStatus] = useState(status || "");
  const [newHighQuality, setNewHighQuality] = useState(high_quality || false);
  const [newTag, setNewTag] = useState(tag || "");

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
      field: "reported_seconds" as const,
      headerName: "Reported Hours",
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "approved_seconds" as const,
      headerName: "Reviewed Hours",
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "real_approved_seconds" as const,
      headerName: "Approved Hours",
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "high_quality" as const,
      headerName: "High Quality?",
    },
    {
      field: "tags" as const,
      headerName: "Tags",
      valueFormatter: (field: any) =>
        field.value
          .map((v: number) => available_tags.find((t) => t.id == v)?.name)
          .join(", "),
    },
    {
      field: "created_at" as const,
      headerName: "Created At",
      valueFormatter: (field: any) => new Date(field.value).toLocaleString(),
    },
  ]);

  function goToPage(page: number) {
    router.get(
      "/admin/projects",
      { page, q, status, tag, high_quality },
      { preserveScroll: true },
    );
  }

  function search() {
    router.get(
      "/admin/projects",
      {
        q: newQuery,
        status: newStatus,
        tag: newTag,
        high_quality: newHighQuality,
      },
      { preserveScroll: true },
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <a
          href="/admin/projects/new"
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white"
        >
          Create Project
        </a>
      </div>

      <div className="my-6 flex gap-3">
        <input
          className="w-full rounded-md px-3 py-1 md:w-1/3"
          placeholder="Search projects..."
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
        />
        {["pending", "submitted", "approved", "rejected"].map((s) => (
          <button
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
            setNewTag(e.target.value);
          }}
        >
          <option value="">All tags</option>
          {available_tags.map((t) => (
            <option
              value={t.name}
              className={`cursor-pointer rounded-full border px-3 py-2 ${newTag === t.name ? "bg-blue-300" : "bg-white"}`}
              selected={t.name == tag}
            >
              {t.name}
            </option>
          ))}
        </select>

        <button
          className={`mx-4 cursor-pointer rounded-full border px-3 py-2 ${newHighQuality ? "bg-blue-300" : "bg-white"}`}
          onClick={() => {
            setNewHighQuality((b) => !b);
          }}
        >
          High Quality
        </button>

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
