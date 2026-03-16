import Layout from "@/layouts/layout";
import { Link } from "@inertiajs/react";
import PageHeading from "@/components/layout/PageHeading";
import ItemComponent from "@/components/shop/Item";
import ReferralItem from "@/components/shop/ReferralItem";
import type { Item } from "@/interfaces/item";

export default function Shop({
  items,
  has_purchased,
  referred_item,
  purchased_item_ids,
}: {
  items: Item[];
  has_purchased: boolean;
  referred_item: Item | null;
  purchased_item_ids: number[];
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
      {referred_item && (
        <div className="mt-8 pl-8">
          <ReferralItem item={referred_item} />
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 gap-4 pl-8 md:grid-cols-2 lg:grid-cols-3">
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
    </Layout>
  );
}
