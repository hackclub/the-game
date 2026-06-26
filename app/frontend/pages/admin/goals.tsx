import Layout from "@/layouts/layout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import type { Goal } from "@/interfaces/goal";
import type { Item } from "@/interfaces/item";

interface Props {
  goals: Goal[];
  items: Item[];
}

export default function Goals({ goals, items }: Props) {
  const [selectedItem, setSelectedItem] = useState<string>("");

  const usedItemIds = new Set(goals.map((g) => g.item.id));
  const availableItems = items.filter((i) => !usedItemIds.has(i.id));

  const addGoal = () => {
    if (!selectedItem) return;
    router.post("/admin/goals", { item_id: selectedItem });
    setSelectedItem("");
  };

  const removeGoal = (id: number) => {
    router.delete(`/admin/goals/${id}`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-1 flex items-center gap-3">
          <a
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-800"
          >
            ←
          </a>
          <h1 className="text-2xl font-bold">Homepage Goals</h1>
        </div>
        <p className="mb-6 pl-12 text-sm text-gray-500">
          Goals appear on every user's homepage as a progress bar tracking their
          ticket balance toward a shop item.
        </p>

        {/* Add goal */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select a shop item…</option>
            {availableItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.price} tickets)
              </option>
            ))}
          </select>
          <button
            onClick={addGoal}
            disabled={!selectedItem}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add goal
          </button>
        </div>

        {/* Existing goals */}
        {goals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-400">
            No goals yet. Add one above to show it on the homepage.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  {goal.item.image ? (
                    <img
                      src={goal.item.image}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">--</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">
                    {goal.item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Target: {goal.item.price} tickets
                  </p>
                </div>
                <button
                  onClick={() => removeGoal(goal.id)}
                  className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
