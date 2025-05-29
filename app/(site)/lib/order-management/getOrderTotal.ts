import { ProductInOrder } from "@shared";
import { getProductPrice } from "../product-management/getProductPrice";
import { OrderType } from "@prisma/client";
import getDiscountedTotal from "./getDiscountedTotal";
import roundToTwo from "../formatting-parsing/roundToTwo";

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
}): number;

export function getOrderTotal(args: {
  order: OrderInputWithoutDiscount;
  applyDiscount?: false;
  round?: boolean;
}): number;

// --- Function Implementation ---

export function getOrderTotal({
  order,
  applyDiscount = false,
  round = false,
}: {
  order: OrderInputWithDiscount | OrderInputWithoutDiscount;
  applyDiscount?: boolean;
  round?: boolean;
}): number {
  const { products, type } = order;

  const orderTotal = products.reduce(
    (acc, product) => acc + product.quantity * getProductPrice(product, type),
    0
  );

  const total = applyDiscount
    ? getDiscountedTotal({
        orderTotal,
        discountPercentage: order.discount ?? 0,
      })
    : orderTotal;

  return round ? roundToTwo(total) : total;
}
