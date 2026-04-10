import Layout from "@/layouts/layout";
import { Item } from "@/interfaces/item";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import ItemForm from "@/components/admin/items/ItemForm";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  items: Item[];
}

export default function Items({ items }: Props) {
  const [rowData, setRowData] = useState(items);
  const [colDefs, setColDefs] = useState([
    {
      field: "id" as const,
      headerName: "ID",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/shop/${field.value}/edit`}
          >
            {field.value}
          </a>
        );
      },
    },
    {
      field: "name" as const,
    },
    {
      field: "description" as const,
    },
    {
      field: "price" as const,
    },
    {
      field: "stock" as const,
    },
    {
      field: "featured" as const,
      headerName: "Featured?",
    },
    {
      field: "one_per_user" as const,
      headerName: "One per user?",
    },
    {
      field: "black_market" as const,
      headerName: "Black market?",
    },
  ]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Items</h1>

      <div className="py-6">
        <h2 className="text-2xl font-bold">Create Item</h2>
        <ItemForm />
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
          enableCellTextSelection={true}
        />
      </div>
    </Layout>
  );
}
