import { MinimalOrder } from "@/app/(site)/lib/shared";
import getDiscountedTotal from "./getDiscountedTotal";
import roundToTwo from "../../utils/global/number/roundToTwo";
import filterDeletedProducts from "../../services/product-management/filterDeletedProducts";

type BaseOrderInput = Pick<MinimalOrder, "products" | "type">;

type OrderInputWithDiscount = BaseOrderInput & {
  discount: number;
};

export type OrderInputWithoutDiscount = BaseOrderInput & {
  discount?: number;
};

// --- Function Overloads ---

export function getOrderTotal(args: {
  order: OrderInputWithDiscount;
  applyDiscount: true;
  round?: boolean;
  onlyPaid?: boolean;
}): number;

export function getOrderTotal(args: {
  order: OrderInputWithoutDiscount;
  applyDiscount?: false;
  round?: boolean;
  onlyPaid?: boolean;
}): number;

// --- Function Implementation ---

export function getOrderTotal({
  order,
  applyDiscount = false,
  round = false,
  onlyPaid = false,
}: {
  order: OrderInputWithDiscount | OrderInputWithoutDiscount;
  applyDiscount?: boolean;
  round?: boolean;
  onlyPaid?: boolean;
}): number {
  const { products } = order;

  const orderTotal = filterDeletedProducts(products).reduce(
    (acc, product) =>
      acc + (onlyPaid ? product.paid_quantity : product.quantity) * product.frozen_price,
    0
  );

  const total = applyDiscount
    ? getDiscountedTotal({
        orderTotal,
        discountPercentage: order.discount ?? 0,
      })
    : orderTotal;

  return round ? parseFloat(roundToTwo(total)) : total;
}
