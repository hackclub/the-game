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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a
            href="/admin/items"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-800"
          >
            ←
          </a>
          <div>
            <p className="text-xs font-medium text-gray-400">Item #{item.id}</p>
            <h1 className="text-2xl leading-tight font-bold">{item.name}</h1>
          </div>
        </div>
        <button
          className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
          onClick={deleteItem}
        >
          Delete
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-5 gap-8">
        {/* Form */}
        <div className="col-span-3">
          <ItemForm
            item={item}
            categories={categories}
            className="flex flex-col gap-5"
          />
        </div>

        {/* Version history */}
        <div className="col-span-2">
          <p className="mb-5 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Version History
          </p>

          {versions.length === 0 ? (
            <p className="text-sm text-gray-400">No changes recorded yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute top-2 bottom-2 left-[7px] w-px bg-gray-200" />
              <div className="flex flex-col gap-6">
                {versions.map((v, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute top-1 left-0 h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-[#ededed]" />
                    <p className="mb-2 text-xs font-semibold text-gray-400">
                      {new Date(v.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {Object.entries(v.changes).map(([key, [from, to]]) => (
                        <div
                          key={key}
                          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
                        >
                          <span className="font-mono text-xs font-medium text-gray-500">
                            {key}
                          </span>
                          <span className="text-xs text-red-400 line-through">
                            {String(from)}
                          </span>
                          <span className="text-xs text-gray-400">→</span>
                          <span className="text-xs font-semibold text-green-600">
                            {String(to)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
