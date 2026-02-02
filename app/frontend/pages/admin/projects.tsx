import Layout from "@/layouts/layout";
import { Project } from "@/interfaces/project";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
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
    { field: "title" as const },
    {
      field: "aasm_state" as const,
      headerName: "Status",
    },
    {
      field: "created_at" as const,
      headerName: "Created At",
      valueFormatter: (field: any) => new Date(field.value).toLocaleString(),
    },
  ]);

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
    </Layout>
  );
}
