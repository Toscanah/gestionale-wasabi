import { ProductInOrder } from "@shared";
import { getProductPrice } from "../product-management/getProductPrice";
import { OrderType } from "@prisma/client";
import getDiscountedTotal from "./getDiscountedTotal";
import roundToTwo from "../formatting-parsing/roundToTwo";
import { only } from "node:test";

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
  const { products, type } = order;

  const orderTotal = products
    .filter((product) => product.state === "IN_ORDER")
    .reduce((acc, product) => {
      const quantity = onlyPaid ? product.paid_quantity : product.quantity;
      return acc + quantity * getProductPrice(product, type);
    }, 0);

  const total = applyDiscount
    ? getDiscountedTotal({
        orderTotal,
        discountPercentage: order.discount ?? 0,
      })
    : orderTotal;

  return round ? parseFloat(roundToTwo(total)) : total;
}
