import { ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType } from "@/prisma/generated/client/enums";
import joinItemsWithComma from "../../../utils/global/string/joinItemsWithComma";

export default function aggregateProducts(
  products: ProductInOrder[],
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

      // Aggregate "to be printed"
      existingProduct.to_be_printed =
        (existingProduct.to_be_printed ?? 0) + (product.to_be_printed ?? 0);
    } else {
      // Add the product to the group as-is
      groupedProducts[optionsKey].push({ ...product });
    }
  });

  return groupedProducts;
}
