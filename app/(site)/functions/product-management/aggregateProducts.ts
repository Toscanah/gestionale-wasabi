import { OrderType } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "./getProductPrice";
import joinItemsWithComma from "../formatting-parsing/joinItemsWithComma";

export default function aggregateProducts(
  products: ProductInOrder[],
  orderType: OrderType
): ProductInOrder[] {
  const aggregated: Record<string, ProductInOrder> = {};

  products.forEach((product) => {
    const optionsString = joinItemsWithComma(product, "options");
    const key = `${product.product.code} ${product.product.desc || ""} ${optionsString}`;

    const aggregatedProduct = aggregated[key];

    if (aggregatedProduct) {
      aggregatedProduct.quantity += product.quantity;
    } else {
      aggregated[key] = { ...product, quantity: product.quantity };
    }

    aggregated[key].total = aggregated[key].quantity * getProductPrice(product, orderType);
  });

  return Object.values(aggregated);
}
