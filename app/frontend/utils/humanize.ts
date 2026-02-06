export function humanize(str: string) {
  return str
    .split("_") // Split by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize
    .join(" "); // Join with space
}
