import { ProductInOrderStatus } from "@prisma/client";
import { ProductInOrder } from "../../shared";

/**
 * Filters out products that are not in the `IN_ORDER` status from the provided array.
 *
 * @param products - An array of `ProductInOrder` objects to be filtered.
 * @returns A new array containing only the products with a status of `ProductInOrderStatus.IN_ORDER`.
 * @throws {Error} If the input is not an array.
 */
export default function filterDeletedProducts(products: ProductInOrder[]): ProductInOrder[] {
  if (!Array.isArray(products)) {
    throw new Error("Expected products to be an array");
  }

  if (products.length === 0) {
    return products;
  }

  return products.filter((product) => product.status == ProductInOrderStatus.IN_ORDER);
}
