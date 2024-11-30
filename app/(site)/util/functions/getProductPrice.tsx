import { OrderType } from "@prisma/client";
import { ProductInOrderType } from "../../types/ProductInOrderType";

export function getProductPrice(product: ProductInOrderType, orderType: OrderType): number {
  return orderType === OrderType.TABLE
    ? product.product.site_price ?? 0
    : product.product.home_price ?? 0;
}
