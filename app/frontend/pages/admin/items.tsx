import Layout from "@/layouts/layout";
import { Item } from "@/interfaces/item";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState, useMemo } from "react";
import ItemForm from "@/components/admin/items/ItemForm";
import { router } from "@inertiajs/react";

interface PriceRevertPreviewItem {
  id: number;
  name: string;
  current_price: number;
  revert_to: number;
  changed_at: string;
}

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  items: Item[];
  categories: string[];
}

export default function Items({ items, categories }: Props) {
  const gridRef = useRef<AgGridReact>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [percentage, setPercentage] = useState<number>(0);
  const [bulkCategory, setBulkCategory] = useState<string>("");
  const [revertPreview, setRevertPreview] = useState<
    PriceRevertPreviewItem[] | null
  >(null);
  const [revertSelected, setRevertSelected] = useState<Set<number>>(new Set());
  const [previewLoading, setPreviewLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const [colDefs] = useState([
    {
      field: "id" as const,
      headerName: "ID",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 90,
      cellRenderer: (field: any) => (
        <a
          className="text-blue-500 underline"
          href={`/shop/${field.value}/edit`}
        >
          {field.value}
        </a>
      ),
    },
    {
      field: "image" as const,
      headerName: "",
      width: 60,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) =>
        params.value ? (
          <img
            src={params.value}
            alt=""
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
            --
          </div>
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

  const openRevertPreview = async () => {
    setPreviewLoading(true);
    const res = await fetch("/admin/items/preview_price_revert");
    const data: PriceRevertPreviewItem[] = await res.json();
    setRevertPreview(data);
    setRevertSelected(new Set(data.map((r) => r.id)));
    setPreviewLoading(false);
  };

  const toggleRevertItem = (id: number) => {
    setRevertSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleRevertAll = () => {
    if (!revertPreview) return;
    setRevertSelected(
      revertSelected.size === revertPreview.length
        ? new Set()
        : new Set(revertPreview.map((r) => r.id)),
    );
  };

  const confirmRevert = () => {
    router.post("/admin/items/revert_price_changes", {
      item_ids: Array.from(revertSelected),
    });
    setRevertPreview(null);
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
        <span className="text-sm font-medium text-gray-500">
          {selectionLabel}
        </span>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Adjust price by
          </label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
            className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
          <label className="text-sm font-medium text-gray-700">
            Set category
          </label>
          <div className="relative">
            <input
              list="bulk-category-list"
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              placeholder="(none)"
              className="w-36 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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

        <div className="ml-auto">
          <button
            onClick={openRevertPreview}
            disabled={previewLoading}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {previewLoading ? "Loading..." : "Revert All Price Changes"}
          </button>
        </div>
      </div>

      {revertPreview !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-1 text-lg font-bold">Revert Price Changes</h2>
            {revertPreview.length === 0 ? (
              <p className="py-4 text-sm text-gray-500">
                No price changes found in version history.
              </p>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  {revertSelected.size} of {revertPreview.length} item
                  {revertPreview.length !== 1 ? "s" : ""} selected to revert:
                </p>
                <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          <input
                            type="checkbox"
                            checked={
                              revertSelected.size === revertPreview.length
                            }
                            ref={(el) => {
                              if (el)
                                el.indeterminate =
                                  revertSelected.size > 0 &&
                                  revertSelected.size < revertPreview.length;
                            }}
                            onChange={toggleRevertAll}
                            className="cursor-pointer"
                          />
                        </th>
                        <th className="px-3 py-2 text-left">Item</th>
                        <th className="px-3 py-2 text-right">Current</th>
                        <th className="px-3 py-2 text-right">Revert to</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {revertPreview.map((row) => (
                        <tr
                          key={row.id}
                          className={`cursor-pointer hover:bg-gray-50 ${!revertSelected.has(row.id) ? "opacity-40" : ""}`}
                          onClick={() => toggleRevertItem(row.id)}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={revertSelected.has(row.id)}
                              onChange={() => toggleRevertItem(row.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2">{row.name}</td>
                          <td className="px-3 py-2 text-right text-gray-400">
                            {row.current_price}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-green-700">
                            {row.revert_to}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setRevertPreview(null)}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {revertPreview.length > 0 && (
                <button
                  onClick={confirmRevert}
                  disabled={revertSelected.size === 0}
                  className="cursor-pointer rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirm Revert ({revertSelected.size})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search items by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredItems}
          columnDefs={colDefs}
          loadThemeGoogleFonts={true}
          enableCellTextSelection={true}
          rowSelection="multiple"
          rowHeight={50}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </Layout>
  );
}
