import Layout from "@/layouts/layout";
import { Item } from "@/interfaces/item";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import ItemForm from "@/components/admin/items/ItemForm";
import { router } from "@inertiajs/react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  items: Item[];
  categories: string[];
}

export default function Items({ items, categories }: Props) {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData] = useState(items);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [percentage, setPercentage] = useState<number>(0);
  const [bulkCategory, setBulkCategory] = useState<string>("");

  const [colDefs] = useState([
    {
      field: "id" as const,
      headerName: "ID",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (field: any) => (
        <a
          className="text-blue-500 underline"
          href={`/shop/${field.value}/edit`}
        >
          {field.value}
        </a>
      ),
    },
    { field: "name" as const },
    { field: "description" as const },
    { field: "price" as const },
    { field: "stock" as const },
    { field: "category" as const, headerName: "Category" },
    { field: "featured" as const, headerName: "Featured?" },
    { field: "super_featured" as const, headerName: "Super featured?" },
    { field: "one_per_user" as const, headerName: "One per user?" },
    { field: "black_market" as const, headerName: "Black market?" },
    { field: "event_related" as const, headerName: "Event related?" },
    { field: "visible" as const, headerName: "Visible in shop?" },
  ]);

  const onSelectionChanged = () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    setSelectedIds(selected.map((r) => r.id));
  };

  const applyPriceAdjustment = () => {
    router.post("/admin/items/bulk_adjust_price", {
      item_ids: selectedIds,
      percentage,
    });
  };

  const applyBulkCategory = () => {
    router.post("/admin/items/bulk_set_category", {
      item_ids: selectedIds,
      category: bulkCategory || null,
    });
  };

  const selectionLabel = `${selectedIds.length} item${selectedIds.length !== 1 ? "s" : ""} selected`;

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Items</h1>

      <div className="py-6">
        <h2 className="text-2xl font-bold">Create Item</h2>
        <div className="mt-4">
          <ItemForm categories={categories} />
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <span className="text-sm font-medium text-gray-500">{selectionLabel}</span>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Adjust price by</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
            className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">%</span>
          <button
            onClick={applyPriceAdjustment}
            disabled={selectedIds.length === 0 || percentage === 0}
            className="cursor-pointer rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Set category</label>
          <div className="relative">
            <input
              list="bulk-category-list"
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              placeholder="(none)"
              className="w-36 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <datalist id="bulk-category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <button
            onClick={applyBulkCategory}
            disabled={selectedIds.length === 0}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
          enableCellTextSelection={true}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </Layout>
  );
}
