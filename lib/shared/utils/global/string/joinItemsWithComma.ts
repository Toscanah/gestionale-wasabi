import {
  CategoryWithOptions,
  ComprehensiveCustomer,
  OptionWithCategories,
} from "@/lib/shared";
import capitalizeFirstLetter from "./capitalizeFirstLetter";
import normalizeCase from "./normalizeCase";
import normalizeAddressCase from "../../domains/address/normalizeAddressCase";

export type JoinItemType = "addresses" | "options" | "categories" | "doorbells";

type JoinOptions = {
  sort?: boolean;
  maxChar?: number;
};

function formatItems(items: any[], formatFn: (item: any) => string, sort: boolean): string {
  const formattedItems = items.map(formatFn);
  return sort ? formattedItems.sort().join(", ") : formattedItems.join(", ");
}

export default function joinItemsWithComma(
  item: any,
  type: JoinItemType,
  options: JoinOptions = {}
): string {
  const { sort = true, maxChar = Infinity }: JoinOptions = options;
  const truncate = (str: string) => str.slice(0, Math.min(str.length, maxChar));

  const formatFns = new Map<JoinItemType, (item: any) => any[]>([
    [
      "doorbells",
      (item) =>
        (item as ComprehensiveCustomer)?.addresses?.map?.((address) =>
          normalizeCase(truncate(address.doorbell))
        ) ?? [],
    ],
    [
      "categories",
      (item) =>
        (item as OptionWithCategories)?.categories?.map?.((cat) =>
          normalizeCase(truncate(cat.category.category))
        ) ?? [],
    ],
    [
      "addresses",
      (item) =>
        (item as ComprehensiveCustomer)?.addresses?.map?.(
          (address) => normalizeAddressCase(truncate(address.street)) + " " + address.civic
        ) ?? [],
    ],
    [
      "options",
      (item) =>
        (item as CategoryWithOptions)?.options?.map?.((option) =>
          normalizeCase(truncate(option.option.option_name))
        ) ?? [],
    ],
  ]);

  if (!formatFns.has(type)) {
    throw new Error(`Unknown data type: ${type}`);
  }

  return formatItems(formatFns.get(type)!(item), (item) => item, sort);
}
