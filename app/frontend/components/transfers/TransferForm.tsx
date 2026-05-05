import { useForm } from "@inertiajs/react";

export default function TransferForm({ user_id }: { user_id: number }) {
  const { data, setData, post, reset } = useForm({
    amount: 0,
    slack_id: "",
    reason: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      confirm(
        `Are you sure you want to transfer ${data.amount} ticket${data.amount === 1 ? "" : "s"} to the user with slack ID ${data.slack_id}? Once approved, this is irreversible.`,
      )
    ) {
      post(`/users/${user_id}/transfers`);
      reset();
    }
  }

  return (
    <div>
      <p className="text-xl font-bold">New transfer</p>
      <form
        onSubmit={handleSubmit}
        className="flex max-w-sm flex-col gap-2 text-lg"
      >
        <div className="flex flex-col">
          <label>
            User Slack ID (ping them in{" "}
            <a
              className="underline"
              href="https://hackclub.enterprise.slack.com/archives/C0159TSJVH8"
            >
              #what-is-my-slack-id
            </a>
            )
          </label>
          <input
            value={data.slack_id}
            onChange={(e) => setData("slack_id", e.target.value)}
            className="rounded-md"
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Amount</label>
          <input
            type="number"
            value={data.amount}
            onChange={(e) => setData("amount", Number(e.target.value))}
            className="rounded-md"
            required
            min="1"
            step="1"
          />
        </div>

        <div className="flex flex-col">
          <label>Reason</label>
          <input
            value={data.reason}
            onChange={(e) => setData("reason", e.target.value)}
            className="rounded-md"
            required
          />
        </div>

        <button className="w-fit cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-semibold text-white">
          Request transfer
        </button>
      </form>
    </div>
  );
}
