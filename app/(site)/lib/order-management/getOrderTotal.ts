import { ProductInOrder } from "@shared";
import { OrderType } from "@prisma/client";
import getDiscountedTotal from "./getDiscountedTotal";
import roundToTwo from "../formatting-parsing/roundToTwo";
import filterDeletedProducts from "../product-management/filterDeletedProducts";

type BaseOrderInput = {
  products: ProductInOrder[];
  type: OrderType;
};

type OrderInputWithDiscount = BaseOrderInput & {
  discount: number;
};

type OrderInputWithoutDiscount = BaseOrderInput & {
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
