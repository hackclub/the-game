import { useForm } from "@inertiajs/react";

export default function AdjustmentForm({ user_id }: { user_id: number }) {
  const { data, setData, post, reset } = useForm({
    amount: 0,
    reason: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    post(`/users/${user_id}/adjustments`);
    reset();
  }

  return (
    <div>
      <p className="text-xl font-bold">New adjustment</p>
      <form
        onSubmit={handleSubmit}
        className="flex max-w-sm flex-col gap-2 text-lg"
      >
        <div className="flex flex-col">
          <label>Amount</label>
          <input
            type="number"
            value={data.amount}
            onChange={(e) => setData("amount", Number(e.target.value))}
            className="rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label>Reason (visible to user)</label>
          <input
            value={data.reason}
            onChange={(e) => setData("reason", e.target.value)}
            className="rounded-md"
          />
        </div>

        <button className="w-min rounded-md bg-blue-500 px-4 py-2 font-semibold text-white">
          Add
        </button>
      </form>
    </div>
  );
}
