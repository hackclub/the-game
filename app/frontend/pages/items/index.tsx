import Layout from "@/layouts/layout";
import { Link } from "@inertiajs/react";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ItemComponent from "@/components/shop/Item";
import ReferralItem from "@/components/shop/ReferralItem";
import { usePage } from "@inertiajs/react";
import type { Item } from "@/interfaces/item";

export default function Shop({
  items,
  has_purchased,
  referred_item,
  purchased_item_ids,
}: {
  items: (Item & { stock_left: number })[];
  has_purchased: boolean;
  referred_item: Item | null;
  purchased_item_ids: number[];
}) {
  const { props } = usePage();

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
      {props.user.wizard && (
        <a
          className="absolute top-5 right-0 bg-black px-8 py-4 text-xl font-bold text-yellow-500"
          href="/shop/platform_nine_and_three_quarters"
        >
          Enter Platform 9 <sup>3</sup>&frasl;<sub>4</sub>
        </a>
      )}
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        {referred_item && <ReferralItem item={referred_item} />}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemComponent
              key={item.id}
              item={item}
              alreadyPurchased={
                item.one_per_user && purchased_item_ids.includes(item.id)
              }
              className={item.super_featured ? "col-span-full" : undefined}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
