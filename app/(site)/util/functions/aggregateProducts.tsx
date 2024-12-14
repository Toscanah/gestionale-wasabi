import { OrderType } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "./getProductPrice";

const formatOptionsString = (options: { option: { option_name: string } }[]) =>
  options
    .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
    .join(", ");

export default function aggregateProducts(
  products: ProductInOrder[],
  orderType: OrderType
): ProductInOrder[] {
  const aggregated: Record<string, ProductInOrder> = {};

  products.forEach((product) => {
    const optionsString = formatOptionsString(product.options || []);
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
