import { SortDirection } from "@/lib/shared";

export type Comparator<V> = (a: V, b: V, direction: SortDirection) => number;

function toDateSafe(val: unknown): Date | null {
  if (val == null) return null;
  if (val instanceof Date) return val;
  if (typeof val === "string" && !isNaN(Date.parse(val))) {
    return new Date(val);
  }
  return null;
}

export default function defaultComparator(
  a: unknown,
  b: unknown,
  direction: SortDirection
): number {
  // handle nulls consistently
  if (a == null && b == null) return 0;
  if (a == null) return 1; // nulls always last
  if (b == null) return -1;

  // numbers
  if (typeof a === "number" && typeof b === "number") {
    return direction === "asc" ? a - b : b - a;
  }

  // dates (covers Date instances and ISO strings)
  const aDate = toDateSafe(a);
  const bDate = toDateSafe(b);
  if (aDate && bDate) {
    const diff = aDate.getTime() - bDate.getTime();
    return direction === "asc" ? diff : -diff;
  }

  // fallback string
  const cmp = String(a).localeCompare(String(b));
  return direction === "asc" ? cmp : -cmp;
}
