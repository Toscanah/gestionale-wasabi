import { OrderType } from "../../types/OrderType";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { getProductPrice } from "./getProductPrice";

export default function aggregateProducts(
  products: ProductInOrderType[],
  orderType: OrderType
): ProductInOrderType[] {
  const aggregated: Record<string, ProductInOrderType> = {};

  products.forEach((product) => {
    const optionsString = product.options
      .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
      .join(", ");

    const key = `${product.product.code} ${product.product.desc} ${optionsString}`;

    if (aggregated[key]) {
      aggregated[key].quantity += product.quantity;
    } else {
      aggregated[key] = { ...product };
    }

    aggregated[key].total = aggregated[key].quantity * getProductPrice(product, orderType);
  });

  return Object.values(aggregated);
}
