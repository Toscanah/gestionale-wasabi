import { OrderType } from "@prisma/client";
import { ProductInOrder } from "@shared"
;

export function getProductPrice(product: ProductInOrder, orderType: OrderType): number {
  return orderType === OrderType.TABLE
    ? product.product.site_price ?? 0
    : product.product.home_price ?? 0;
}
