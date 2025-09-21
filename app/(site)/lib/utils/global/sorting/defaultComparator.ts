import { SortDirection } from "../../../shared";

export type Comparator<T> = (a: T, b: T, direction: SortDirection) => number;

export default function defaultComparator(a: unknown, b: unknown, direction: SortDirection): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // numbers
  if (typeof a === "number" && typeof b === "number") {
    return direction === "asc" ? a - b : b - a;
  }

  // dates
  if (a instanceof Date && b instanceof Date) {
    return direction === "asc" ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
  }

  // fallback string
  const cmp = String(a).localeCompare(String(b));
  return direction === "asc" ? cmp : -cmp;
}
