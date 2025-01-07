import { CategoryWithOptions, CustomerWithDetails, OptionWithCategories } from "../../models";
import capitalizeFirstLetter from "./capitalizeFirstLetter";

type ItemType = "addresses" | "customers" | "options" | "categories" | "doorbells";

function formatItems<T>(items: T[], formatFn: (item: T) => string, sort: boolean): string {
  const formattedItems = items.map(formatFn);
  return sort ? formattedItems.sort().join(", ") : formattedItems.join(", ");
}

export default function joinItemsWithComma<T>(
  item: T,
  type: ItemType,
  options: { sort?: boolean; maxChar?: number } = { sort: false, maxChar: Infinity }
): string {
  const { sort = false, maxChar = Infinity } = options;

  const truncate = (str: string) => str.slice(0, Math.min(str.length, maxChar));

  switch (type) {
    case "doorbells":
      return formatItems(
        (item as CustomerWithDetails).addresses,
        (address) => capitalizeFirstLetter(truncate(address.doorbell)),
        sort
      );

    case "categories":
      return formatItems(
        (item as OptionWithCategories).categories,
        (cat) => capitalizeFirstLetter(truncate(cat.category.category)),
        sort
      );

    case "addresses":
      return formatItems(
        (item as CustomerWithDetails).addresses,
        (address) => capitalizeFirstLetter(truncate(address.street)) + " " + address.civic,
        sort
      );

    case "options":
      return formatItems(
        (item as CategoryWithOptions).options,
        (option) => capitalizeFirstLetter(truncate(option.option.option_name)),
        sort
      );

    default:
      throw new Error(`Unknown data type: ${type}`);
  }
}
