import { ProductInOrderStatus } from "@prisma/client";

/**
 * Filters out products that are not in the `IN_ORDER` status.
 *
 * @template T - The type of the product, which must include a `status` property of type `ProductInOrderStatus`.
 * @param products - An array of products to filter.
 * @returns An array containing only the products whose `status` is `ProductInOrderStatus.IN_ORDER`.
 * @throws {Error} If the `products` parameter is not an array.
 */
export default function filterDeletedProducts<T extends { status: ProductInOrderStatus }>(
  products: T[]
): T[] {
  if (!Array.isArray(products)) {
    throw new Error("Expected products to be an array");
  }

  return products.filter((product) => product.status === ProductInOrderStatus.IN_ORDER);
}
