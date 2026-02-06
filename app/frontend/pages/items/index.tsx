import Layout from "@/layouts/layout";
import ItemComponent from "@/components/shop/Item";
import type { Item } from "@/interfaces/item";

export default function Shop({ items }: { items: Item[] }) {
  return (
    <Layout>
      <h2 className="mb-1 text-3xl font-bold">Shop</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemComponent item={item} />
        ))}
      </div>
    </Layout>
  );
}
