import { OrderType } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/lib/shared";

type ProductInOrderWithPrice = Partial<ProductInOrder> & {
  product: {
    site_price?: number;
    home_price?: number;
  };
};

export function getProductPrice(product: ProductInOrderWithPrice, orderType: OrderType): number {
  return orderType === OrderType.TABLE
    ? product.product.site_price ?? 0
    : product.product.home_price ?? 0;
}
