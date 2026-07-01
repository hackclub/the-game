import { useForm } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import type { Item } from "@/interfaces/item";

type FlagKey =
  | "featured"
  | "super_featured"
  | "one_per_user"
  | "black_market"
  | "event_related"
  | "grants_platform_access"
  | "visible";

const FLAGS: { key: FlagKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "super_featured", label: "Super featured" },
  { key: "one_per_user", label: "One per user" },
  { key: "black_market", label: "Black market" },
  { key: "event_related", label: "Event related" },
  { key: "grants_platform_access", label: "Grants platform access" },
  { key: "visible", label: "Visible in shop" },
];

const INPUT =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function CategoryCombobox({
  value,
  categories,
  onChange,
}: {
  value: string | null;
  categories: string[];
  onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const display = value ?? "";
  const filtered = display
    ? categories.filter((c) => c.toLowerCase().includes(display.toLowerCase()))
    : categories;

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <input
          className={INPUT + " flex-1"}
          placeholder="Uncategorized"
          value={display}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value || null);
            setOpen(true);
          }}
        />
        {display && (
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
            onClick={() => onChange(null)}
          >
            Clear
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.map((c) => (
            <button
              key={c}
              type="button"
              className="block w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-blue-50 hover:text-blue-700"
              onMouseDown={() => {
                onChange(c);
                setOpen(false);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ItemForm({
  item,
  categories = [],
  className = "flex max-w-xl flex-col gap-5",
}: {
  item?: Item;
  categories?: string[];
  className?: string;
}) {
  const { data, setData, post, patch, progress } = useForm({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: String(item?.price ?? 0),
    golden_price: item?.golden_price != null ? String(item.golden_price) : "",
    image: item?.image ? (0 as const) : (null as File | null),
    featured: item?.featured ?? false,
    super_featured: item?.super_featured ?? false,
    one_per_user: item?.one_per_user ?? false,
    stock: item?.stock != null ? String(item.stock) : null,
    black_market: item?.black_market ?? false,
    event_related: item?.event_related ?? false,
    grants_platform_access: item?.grants_platform_access ?? false,
    visible: item?.visible ?? true,
    category: item?.category ?? null,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d+$/.test(data.price)) {
      alert("Price must be a whole number.");
      return;
    }
    if (data.golden_price !== "" && !/^\d+$/.test(data.golden_price)) {
      alert("Golden ticket price must be a whole number.");
      return;
    }
    if (data.stock !== null && !/^\d+$/.test(data.stock)) {
      alert("Stock must be a whole number.");
      return;
    }
    if (item) {
      patch(`/shop/${item.id}`, { forceFormData: true });
    } else {
      post("/shop", { forceFormData: true });
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Basic Info */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          Basic Info
        </p>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            className={INPUT}
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            className={INPUT + " min-h-[80px] resize-y"}
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          Pricing & Stock
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Price (tickets)
            </label>
            <input
              className={INPUT}
              type="text"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Golden ticket price
            </label>
            <input
              className={INPUT}
              type="text"
              placeholder="Same as price"
              value={data.golden_price}
              onChange={(e) => setData("golden_price", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-400">
              Price for golden ticket holders. Leave blank for no discount.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Stock
            </label>
            {data.stock === null ? (
              <div className={INPUT + " text-gray-400 italic"}>Unlimited</div>
            ) : (
              <input
                className={INPUT}
                type="text"
                value={data.stock}
                onChange={(e) => setData("stock", e.target.value)}
              />
            )}
            <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={data.stock === null}
                onChange={(e) =>
                  setData("stock", e.target.checked ? null : "0")
                }
                className="h-3.5 w-3.5 rounded accent-blue-600"
              />
              Unlimited
            </label>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Flags
        </p>
        <div className="grid grid-cols-2 gap-2">
          {FLAGS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 px-3 py-2.5 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={(data[key] as boolean) ?? false}
                onChange={(e) => setData(key as any, e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Category
        </p>
        <CategoryCombobox
          value={data.category}
          categories={categories}
          onChange={(v) => setData("category", v)}
        />
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  setData("category", data.category === c ? null : c)
                }
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  data.category === c
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Image
        </p>
        {data.image === 0 && item?.image && (
          <div className="relative mb-3 h-52 w-fit">
            <img
              src={item.image}
              alt="Item image"
              className="block max-h-full w-auto max-w-full rounded-lg object-contain"
            />
            <button
              type="button"
              className="absolute top-2 right-2 h-7 w-7 cursor-pointer rounded-full bg-black/70 text-sm font-bold text-white hover:bg-black"
              onClick={() => setData("image", null)}
            >
              ✕
            </button>
          </div>
        )}
        <input
          className="w-full cursor-pointer rounded-lg border border-gray-200 p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
        />
        {progress && (
          <div className="mt-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        {item ? "Save changes" : "Create item"}
      </button>
    </form>
  );
}
