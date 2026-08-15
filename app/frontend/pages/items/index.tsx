import Layout from "@/layouts/layout";
import { Link, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import IdvVerificationAlert from "@/components/IdvVerificationAlert";
import PageHeading from "@/components/layout/PageHeading";
import ItemComponent from "@/components/shop/Item";
import ReferralItem from "@/components/shop/ReferralItem";
import type { Item } from "@/interfaces/item";
import type { SharedProps } from "@/types";

const OTHER = "__other__";

function categoryLabel(category: string) {
  if (category === OTHER) return "Other";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function Shop({
  items,
  has_purchased,
  referred_item,
  purchased_item_ids,
  goal_by_item,
}: {
  items: (Item & { stock_left: number })[];
  has_purchased: boolean;
  referred_item: Item | null;
  purchased_item_ids: number[];
  goal_by_item: Record<number, number>;
}) {
  const { props } = usePage<SharedProps>();
  const shopLocked = !props.user.is_admin && !props.user.is_shop_approved;
  const [selected, setSelected] = useState<string | null>(null);

  // Group items by category, preserving the server's sort order within groups.
  const groups = useMemo(() => {
    const map = new Map<string, (Item & { stock_left: number })[]>();
    for (const item of items) {
      const key = item.category || OTHER;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  // Categories first (alphabetical), with the catch-all "Other" group last.
  const categories = useMemo(
    () =>
      Array.from(groups.keys()).sort((a, b) => {
        if (a === OTHER) return 1;
        if (b === OTHER) return -1;
        return a.localeCompare(b);
      }),
    [groups],
  );

  const hasCategories = categories.length > 1;
  const visible = selected && groups.has(selected) ? [selected] : categories;

  function renderGrid(cat: string) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.get(cat)!.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            alreadyPurchased={
              item.one_per_user && purchased_item_ids.includes(item.id)
            }
            goalId={goal_by_item[item.id]}
            className={item.super_featured ? "col-span-full" : undefined}
          />
        ))}
      </div>
    );
  }

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
      <div className="mt-8 flex flex-col gap-8 pl-8">
        <IdvVerificationAlert />

        {shopLocked && (
          <div className="rounded-xl border border-gray-300 bg-gray-100 p-6 text-gray-800">
            <span className="text-xl font-bold">The shop is locked</span>
            <p className="mt-1 text-lg">
              Only approved accounts can buy items right now. Ask an admin to
              approve your account.
            </p>
          </div>
        )}

        {referred_item && <ReferralItem item={referred_item} />}

        {/* Category filter */}
        {hasCategories && (
          <div className="sticky top-0 z-20 -mx-1 flex flex-wrap gap-2 bg-[#ededed]/90 px-1 py-2 backdrop-blur">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className={`smoothing-black cursor-pointer rounded-full border-2 border-black px-5 py-1.5 text-lg font-bold tracking-tight transition-colors ${
                selected === null
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-[#fecb0d]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelected(cat)}
                className={`smoothing-black cursor-pointer rounded-full border-2 border-black px-5 py-1.5 text-lg font-bold tracking-tight transition-colors ${
                  selected === cat
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-[#fecb0d]"
                }`}
              >
                {categoryLabel(cat)}
                <span className="ml-2 opacity-50">
                  {groups.get(cat)!.length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Sections */}
        <div className="flex flex-col gap-12">
          {visible.map((cat) => (
            <section key={cat} className="flex flex-col gap-4">
              {hasCategories && selected === null && (
                <h2 className="smoothing-black text-3xl font-bold tracking-[-0.03em]">
                  {categoryLabel(cat)}
                </h2>
              )}
              {renderGrid(cat)}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
