import Layout from "@/layouts/layout";
import { PrivateUser } from "@/interfaces/user";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  users: PrivateUser[];
}

export default function Projects({ users }: Props) {
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

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
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
