import Layout from "@/layouts/layout";
import { Project } from "@/interfaces/project";
import { PublicUser } from "@/interfaces/user";
import { Pagination } from "@/interfaces/pagination";
import { ProjectTag } from "@/interfaces/project_tag";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  projects: (Project & { user: PublicUser })[];
  q: string;
  status: string;
  high_quality: boolean;
  tag: string;
  per_page: number;
  available_tags: ProjectTag[];
  pagination: Pagination;
}

export default function Projects({
  projects,
  q,
  status,
  high_quality,
  tag,
  per_page,
  available_tags,
  pagination,
}: Props) {
  const [newQuery, setNewQuery] = useState(q || "");
  const [newStatus, setNewStatus] = useState(status || "");
  const [newHighQuality, setNewHighQuality] = useState(high_quality || false);
  const [newTag, setNewTag] = useState(tag || "");
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
      status: newStatus,
      tag: newTag,
      high_quality: newHighQuality,
      per_page: perPage,
      ...overrides,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === false) {
        delete params[key];
      }
    });

    lastServerQuery.current = params.q || "";
    router.get("/admin/projects", params, {
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

  // Immediate refresh on filter changes (status, tag, high quality, per page)
  const handleStatusToggle = (s: string) => {
    const nextStatus = newStatus === s ? "" : s;
    setNewStatus(nextStatus);
    navigateWithFilters({ status: nextStatus });
  };

  const handleTagChange = (t: string) => {
    setNewTag(t);
    navigateWithFilters({ tag: t });
  };

  const handleHighQualityToggle = () => {
    const next = !newHighQuality;
    setNewHighQuality(next);
    navigateWithFilters({ high_quality: next });
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
      field: "screenshot" as const,
      headerName: "",
      width: 60,
      cellRenderer: (field: any) => {
        if (!field.value) return null;
        return (
          <img
            className="h-8 w-12 rounded object-cover"
            src={field.value}
            alt=""
          />
        );
      },
      sortable: false,
      filter: false,
    },
    {
      field: "id" as const,
      headerName: "ID",
      width: 80,
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/projects/${field.value}/manage`}
          >
            {field.value}
          </a>
        );
      },
    },
    { field: "user.id" as const, headerName: "User ID", width: 90 },
    { field: "title" as const, minWidth: 150 },
    {
      field: "aasm_state" as const,
      headerName: "Status",
      width: 110,
    },
    {
      field: "reported_seconds" as const,
      headerName: "Reported Hrs",
      width: 120,
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "approved_seconds" as const,
      headerName: "Reviewed Hrs",
      width: 120,
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "real_approved_seconds" as const,
      headerName: "Approved Hrs",
      width: 120,
      valueFormatter: (field: any) => (field.value / 3600).toPrecision(4),
    },
    {
      field: "high_quality" as const,
      headerName: "HQ?",
      width: 70,
    },
    {
      field: "tags" as const,
      headerName: "Tags",
      width: 130,
      valueFormatter: (field: any) =>
        field.value
          .map((v: number) => available_tags.find((t) => t.id == v)?.name)
          .join(", "),
    },
    {
      field: "created_at" as const,
      headerName: "Created At",
      width: 170,
      valueFormatter: (field: any) => new Date(field.value).toLocaleString(),
    },
  ]);

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

      <div className="my-6 flex flex-wrap items-center gap-3">
        <input
          className="w-full rounded-md px-3 py-1 md:w-1/3"
          placeholder="Search by title, username, or ID..."
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
        />
        {["pending", "submitted", "approved", "rejected"].map((s) => (
          <button
            key={s}
            className={`cursor-pointer rounded-full border px-3 py-2 ${newStatus === s ? "bg-blue-300" : "bg-white"}`}
            onClick={() => handleStatusToggle(s)}
          >
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}

        <select
          className="ml-4 rounded-md border border-black"
          value={newTag}
          onChange={(e) => handleTagChange(e.target.value)}
        >
          <option value="">All tags</option>
          {available_tags.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <button
          className={`mx-4 cursor-pointer rounded-full border px-3 py-2 ${newHighQuality ? "bg-blue-300" : "bg-white"}`}
          onClick={handleHighQualityToggle}
        >
          High Quality
        </button>
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={projects}
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
    </Layout>
  );
}
