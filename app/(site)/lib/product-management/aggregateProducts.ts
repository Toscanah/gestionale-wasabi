import { ProductInOrder } from "@shared"
;
import { OrderType } from "@prisma/client";
import { getProductPrice } from "./getProductPrice";
import joinItemsWithComma from "../formatting-parsing/joinItemsWithComma";

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
        !existingProduct.additional_note && // The existing product must have no note
        !product.additional_note // The new product must also have no note
    );

    if (existingProductIndex !== -1) {
      const existingProduct = groupedProducts[optionsKey][existingProductIndex];

      // Aggregate quantities
      existingProduct.quantity += product.quantity;
      existingProduct.printed_amount =
        (existingProduct.printed_amount || 0) + product.printed_amount;

      // Recalculate total price
      existingProduct.total =
        existingProduct.quantity * getProductPrice(existingProduct, orderType);
    } else {
      // Add the product to the group as-is
      groupedProducts[optionsKey].push({ ...product });
    }
  });

  return groupedProducts;
}
