import { ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";
import joinItemsWithComma from "../../formatting-parsing/joinItemsWithComma";

export default function aggregateProducts(
  products: ProductInOrder[],
  orderType: OrderType
): Record<string, ProductInOrder[]> {
  const groupedProducts: Record<string, ProductInOrder[]> = {};

  products.forEach((product) => {
    // Create a key based on options
    const optionsKey = product.options.length
      ? joinItemsWithComma(product, "options", { sort: true })
      : "no_options";

    if (!groupedProducts[optionsKey]) {
      groupedProducts[optionsKey] = [];
    }

    // Find if a product with the same code and no conflicting note already exists in the group
    const existingProductIndex = groupedProducts[optionsKey].findIndex(
      (existingProduct) =>
        existingProduct.product.code === product.product.code &&
        !existingProduct.variation &&
        !product.variation
    );

    if (existingProductIndex !== -1) {
      const existingProduct = groupedProducts[optionsKey][existingProductIndex];

      // Aggregate quantities
      existingProduct.quantity += product.quantity;
      existingProduct.printed_amount =
        (existingProduct.printed_amount || 0) + product.printed_amount;
    } else {
      // Add the product to the group as-is
      groupedProducts[optionsKey].push({ ...product });
    }
  });

  return groupedProducts;
}
