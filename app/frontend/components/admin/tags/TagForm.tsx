import { useForm } from "@inertiajs/react";
import type { ProjectTag } from "@/interfaces/project_tag";

export default function TagForm({ tag }: { tag?: ProjectTag }) {
  const { data, setData, post, patch } = useForm({
    name: tag?.name,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (tag) {
      patch(`/admin/tags/${tag.id}`);
    } else {
      post("/admin/tags");
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

      <button className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
        Submit
      </button>
    </form>
  );
}
