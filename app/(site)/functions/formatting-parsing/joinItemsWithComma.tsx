import { CategoryWithOptions, CustomerWithDetails, OptionWithCategories } from "../../models";

type ItemsType = "addresses" | "customers" | "options" | "categories" | "doorbells";

function formatItems<T>(items: T[], formatFn: (item: T) => string, sort: boolean): string {
  const formattedItems = items.map(formatFn);
  return sort ? formattedItems.sort().join(", ") : formattedItems.join(", ");
}

export default function joinItemsWithComma<T>(
  item: T,
  type: ItemsType,
  options = { sort: false }
): string {
  const { sort } = options;

  switch (type) {
    case "doorbells":
      return formatItems(
        (item as CustomerWithDetails).addresses,
        (address) => address.doorbell.charAt(0).toUpperCase() + address.doorbell.slice(1),
        sort
      );

    case "categories":
      return formatItems(
        (item as OptionWithCategories).categories,
        (cat) => cat.category.category.charAt(0).toUpperCase() + cat.category.category.slice(1),
        sort
      );

    case "addresses":
      return formatItems(
        (item as CustomerWithDetails).addresses,
        (address) =>
          address.street.charAt(0).toUpperCase() + address.street.slice(1) + " " + address.civic,
        sort
      );

    case "options":
      return formatItems(
        (item as CategoryWithOptions).options,
        (option) =>
          option.option.option_name.charAt(0).toUpperCase() + option.option.option_name.slice(1),
        sort
      );

    default:
      throw new Error(`Unknown data type: ${type}`);
  }
}
