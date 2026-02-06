import { useForm } from "@inertiajs/react";
import type { Item } from "@/interfaces/item";

export default function ItemForm({ item }: { item?: Item }) {
  const { data, setData, post, patch } = useForm({
    name: item?.name,
    description: item?.description,
    price: item?.price,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (item) {
      patch(`/shop/${item.id}`);
    } else {
      post("/shop");
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

      <button className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
        Submit
      </button>
    </form>
  );
}
