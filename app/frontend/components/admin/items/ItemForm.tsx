import { useForm } from "@inertiajs/react";
import type { Item } from "@/interfaces/item";

export default function ItemForm({ item }: { item?: Item }) {
  const { data, setData, post, patch, progress } = useForm({
    name: item?.name,
    description: item?.description,
    price: item?.price,
    image: item?.image ? 0 : (null as File | null | 0),
    featured: item?.featured,
    one_per_user: item?.one_per_user,
    stock: item?.stock,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (item) {
      patch(`/shop/${item.id}`, { forceFormData: true });
    } else {
      post("/shop", { forceFormData: true });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col">
        <label className="font-bold">Name</label>
        <input
          className="rounded-md p-2"
          type="text"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-bold">Description</label>
        <textarea
          className="rounded-md p-2"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-bold">Price</label>
        <input
          className="rounded-md p-2"
          type="number"
          value={data.price}
          onChange={(e) => setData("price", parseInt(e.target.value))}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-bold">Stock?</label>
        <input
          className="rounded-md p-2"
          type="number"
          value={data.stock}
          onChange={(e) => setData("stock", parseInt(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={data.featured || false}
          onChange={(e) => setData("featured", e.target.checked)}
        />
        <label htmlFor="featured" className="font-bold">
          Featured
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="one_per_user"
          type="checkbox"
          checked={data.one_per_user || false}
          onChange={(e) => setData("one_per_user", e.target.checked)}
        />
        <label htmlFor="one_per_user" className="font-bold">
          One per user
        </label>
      </div>

      <div className="flex flex-col">
        <label className="font-bold">Image</label>
        {data.image === 0 && item?.image && (
          <div className="relative mt-1 h-52 w-fit">
            <img
              src={item.image}
              alt="Item image"
              className="block max-h-full w-auto max-w-full object-contain"
            />
            <button
              type="button"
              className="absolute top-2 right-2 h-8 w-8 cursor-pointer bg-black text-sm font-bold text-white"
              onClick={() => setData("image", null)}
            >
              ✕
            </button>
          </div>
        )}
        <input
          className="mt-1 cursor-pointer rounded-md border p-2"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
        />
        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}
      </div>

      <button className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
        Submit
      </button>
    </form>
  );
}
