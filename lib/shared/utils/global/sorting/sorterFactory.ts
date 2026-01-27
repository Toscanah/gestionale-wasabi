// sorterFactory.ts
import get from "lodash/get";
import defaultComparator, { Comparator } from "./defaultComparator";

// Helpers
const isDateLike = (v: unknown) =>
  v instanceof Date || (typeof v === "string" && !isNaN(Date.parse(v as string)));

const nullsLast =
  <T>(cmp: Comparator<T>): Comparator<T | null | undefined> =>
  (a, b, dir) => {
    if (a == null && b == null) return 0;
    if (a == null) return 1; // always sink nulls
    if (b == null) return -1;
    return cmp(a, b, dir);
  };

const numberComparator: Comparator<number> = (a, b, dir) => (dir === "asc" ? a - b : b - a);

const dateComparator: Comparator<Date | string> = (a, b, dir) => {
  const aT = a instanceof Date ? a.getTime() : Date.parse(a as string);
  const bT = b instanceof Date ? b.getTime() : Date.parse(b as string);
  return dir === "asc" ? aT - bT : bT - aT;
};

function inferComparator(aVal: unknown, bVal: unknown): Comparator<any> {
  if (typeof aVal === "number" && typeof bVal === "number") {
    return nullsLast(numberComparator);
  }
  if (isDateLike(aVal) && isDateLike(bVal)) {
    return nullsLast(dateComparator);
  }
  // fallback to your default (which already does nulls-last + string compare)
  return defaultComparator;
}

type SortItem = { field: string; direction: "asc" | "desc" };
type ComparatorMap = Record<string, Comparator<any>>;

/**
 * Returns an Array.prototype.sort comparator
 */
export default function sorterFactory(sort: SortItem[], overrides: ComparatorMap = {}) {
  return (rowA: any, rowB: any) => {
    for (const { field, direction } of sort) {
      const aVal = get(rowA, field);
      const bVal = get(rowB, field);

      const cmp = overrides[field] ?? inferComparator(aVal, bVal);

      const res = cmp(aVal, bVal, direction as any);
      if (res !== 0) return res;
    }
    return 0;
  };
}
