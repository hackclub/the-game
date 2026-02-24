import Layout from "@/layouts/layout";
import { Order } from "@/interfaces/orders";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import ItemForm from "@/components/admin/items/ItemForm";


ModuleRegistry.registerModules([AllCommunityModule]);


interface Props {
  orders: Order[];
}


export default function Orders({ orders }: Props) {
  const [rowData, setRowData] = useState(orders);
  const [colDefs, setColDefs] = useState([
    {
      field: "id" as const,
      headerName: "Order ID",
      cellRenderer: (field: any) => {
        return (
          <a
            className="text-blue-500 underline"
            href={`/orders/${field.value}`}
          >
            {field.value}
          </a>
        );
      },
    },
    {
      field: "item_id" as const,
      headerName: "Item ID",
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
      field: "user_id" as const,
      headerName: "User ID"
    },
  ]);
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Orders</h1>
      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
        />
      </div>
    </Layout>
  )
}