import { router } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import ItemForm from "@/components/admin/items/ItemForm";
import type { Item } from "@/interfaces/item";

export default function EditItem({
  item,
  versions,
  categories,
}: {
  item: Item;
  versions: {
    timestamp: string;
    changes: { [key: string]: [any, any] };
  }[];
  categories: string[];
}) {
  function deleteItem(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this item?")) {
      router.delete(`/shop/${item.id}`);
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm text-gray-500">Item #{item.id}</p>
          <h2 className="text-3xl font-bold">{item.name}</h2>
        </div>
        <button
          className="mt-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          onClick={deleteItem}
        >
          Delete item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ItemForm item={item} categories={categories} />

        <div>
          <h3 className="mb-4 text-xl font-bold">Version History</h3>
          {versions.length === 0 ? (
            <p className="text-sm text-gray-500">No changes recorded yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {versions.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <p className="mb-2 text-xs font-semibold text-gray-400">
                    {new Date(v.timestamp).toLocaleString()}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {Object.entries(v.changes).map(([key, diff]) => (
                      <li key={key} className="text-sm">
                        <span className="font-semibold text-gray-700">
                          {key}
                        </span>
                        <span className="ml-1 text-gray-400">
                          {String(diff[0])} → {String(diff[1])}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
