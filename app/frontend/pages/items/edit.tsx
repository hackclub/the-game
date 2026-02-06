import { router } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import ItemForm from "@/components/admin/items/ItemForm";
import type { Item } from "@/interfaces/item";

export default function EditItem({ item }: { item: Item }) {
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
      <ItemForm item={item} />
    </Layout>
  );
}
