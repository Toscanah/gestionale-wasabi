import { ProductInOrderStatus } from "@prisma/client";
import { ProductInOrder } from "../../shared";

export default function filterDeletedProducts(products: ProductInOrder[]): ProductInOrder[] {
  if (!Array.isArray(products)) {
    throw new Error("Expected products to be an array");
  }

  if (products.length === 0) {
    return products;
  }

  return products.filter((product) => product.status == ProductInOrderStatus.IN_ORDER);
}
