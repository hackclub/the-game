import Layout from "@/layouts/layout";
import { Link } from "@inertiajs/react";
import PageHeading from "@/components/layout/PageHeading";
import ItemComponent from "@/components/shop/Item";
import type { Item } from "@/interfaces/item";

export default function Shop({
  items,
  has_purchased,
}: {
  items: Item[];
  has_purchased: boolean;
}) {
  return (
    <Layout>
      <PageHeading
        title="Shop"
        subtitle={
          <>
            Spend your hard-earned tickets on cool stuff!
            <br />
            {has_purchased && (
              <Link
                href="/shop/orders"
                className="mt-2 inline-block bg-black px-4 py-1.5 font-bold text-white no-underline transition-colors hover:bg-[#fecb0d] hover:text-black"
              >
                View Orders
              </Link>
            )}
          </>
        }
      />
      <div className="mt-8 grid grid-cols-1 gap-4 pl-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemComponent key={item.id} item={item} />
        ))}
      </div>
    </Layout>
  );
}
