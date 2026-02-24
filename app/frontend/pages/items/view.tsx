import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import ItemComponent from "@/components/shop/Item";
import type { Item } from "@/interfaces/item";

export default function Shop({ items }: { items: Item[] }) {
  return (
    <Layout>
      <PageHeading
        title="Shop"
        subtitle="Spend your hard-earned tickets on cool stuff!"
      />
      <div className="mt-8 grid grid-cols-1 gap-4 pl-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemComponent key={item.id} item={item} />
        ))}
      </div>
    </Layout>
  );
}
