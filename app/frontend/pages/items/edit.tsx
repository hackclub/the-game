import { router } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import ItemForm from "@/components/admin/items/ItemForm";
import type { Item } from "@/interfaces/item";

export default function EditItem({
  item,
  versions,
}: {
  item: Item;
  versions: {
    timestamp: string;
    changes: { [key: string]: [any, any] };
  }[];
}) {
  function deleteItem(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this item?")) {
      router.delete(`/shop/${item.id}`);
    }
  }

  return (
    <Layout>
      <div className="mb-2 flex w-full items-center gap-6">
        <h2 className="mb-1 text-3xl font-bold">Edit Item</h2>
        <button
          className="cursor-pointer rounded-md bg-red-500 p-2 font-bold text-white"
          onClick={deleteItem}
        >
          Delete
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <ItemForm item={item} />
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Versions</h2>
          {versions.map((v) => (
            <div className="rounded-lg border border-black bg-white p-4">
              <p>{new Date(v.timestamp).toLocaleString()}</p>
              <ul>
                {Object.entries(v.changes).map(([key, diff]) => (
                  <li>
                    <span className="font-bold">{key}</span>:&nbsp;
                    {diff[0]} -&gt; {diff[1]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
