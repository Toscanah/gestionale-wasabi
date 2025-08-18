import { CategoryWithOptions, CustomerWithDetails, OptionWithCategories } from "@/app/(site)/lib/shared"
;
import capitalizeFirstLetter from "./capitalizeFirstLetter";

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
  const { sort = false, maxChar = Infinity }: JoinOptions = options;
  const truncate = (str: string) => str.slice(0, Math.min(str.length, maxChar));

  const formatFns = new Map<JoinItemType, (item: any) => any[]>([
    [
      "doorbells",
      (item) =>
        (item as CustomerWithDetails).addresses.map((address) =>
          capitalizeFirstLetter(truncate(address.doorbell))
        ),
    ],
    [
      "categories",
      (item) =>
        (item as OptionWithCategories).categories.map((cat) =>
          capitalizeFirstLetter(truncate(cat.category.category))
        ),
    ],
    [
      "addresses",
      (item) =>
        (item as CustomerWithDetails).addresses.map(
          (address) => capitalizeFirstLetter(truncate(address.street)) + " " + address.civic
        ),
    ],
    [
      "options",
      (item) =>
        (item as CategoryWithOptions).options.map((option) =>
          capitalizeFirstLetter(truncate(option.option.option_name))
        ),
    ],
  ]);

  if (!formatFns.has(type)) {
    throw new Error(`Unknown data type: ${type}`);
  }

  return formatItems(formatFns.get(type)!(item), (item) => item, sort);
}
