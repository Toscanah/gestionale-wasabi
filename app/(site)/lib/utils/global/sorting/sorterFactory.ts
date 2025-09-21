import { SortDirection } from "../../../shared";
import getNestedValue from "../getNestedValue";
import defaultComparator, { Comparator } from "./defaultComparator";

export default function sorterFactory<T>(
  sort: { field: string; direction: SortDirection }[],
  customComparators: Record<string, Comparator<T>> = {}
) {
  return (a: T, b: T): number => {
    for (const { field, direction } of sort) {
      const comparator = customComparators[field] ?? defaultComparator;
      const aVal = getNestedValue(a, field);
      const bVal = getNestedValue(b, field);

      const result = comparator(aVal as any, bVal as any, direction);
      if (result !== 0) return result;
    }
    return 0;
  };
}
