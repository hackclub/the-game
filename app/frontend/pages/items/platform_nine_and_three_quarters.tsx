import Layout from "@/layouts/layout";
import { Link } from "@inertiajs/react";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ItemComponent from "@/components/shop/Item";
import type { Item } from "@/interfaces/item";

export default function PlatformNineAndThreeQuarters({
  items,
  has_purchased,
  purchased_item_ids,
}: {
  items: (Item & { stock_left: number })[];
  has_purchased: boolean;
  purchased_item_ids: number[];
}) {
  return (
    <Layout className="bg-gray-900">
      <PageHeading
        title={"Platform 9 ¾"}
        subtitle={
          <>
            <span className="text-white">Yer a wizard!</span>
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
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemComponent
              key={item.id}
              item={item}
              alreadyPurchased={
                item.one_per_user && purchased_item_ids.includes(item.id)
              }
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
