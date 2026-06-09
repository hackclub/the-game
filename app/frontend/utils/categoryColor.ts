const COLORS: Record<string, string> = {
  grants: "bg-blue-100 text-blue-700 border-blue-200",
  warehouse: "bg-violet-100 text-violet-700 border-violet-200",
};

export function categoryBadgeClass(category: string): string {
  return (
    COLORS[category.toLowerCase()] ??
    "bg-amber-100 text-amber-700 border-amber-200"
  );
}
