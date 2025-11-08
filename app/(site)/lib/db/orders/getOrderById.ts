import { OrderType } from "@prisma/client";
import prisma from "../prisma";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productInOrderInclude,
  orderPromotionUsagesInclude,
} from "../includes";
import {
  TableOrder,
  HomeOrder,
  PickupOrder,
  OrderByType,
  OrderContracts,
} from "@/app/(site)/lib/shared";

type OrderVariant = OrderContracts.GetById.Input["variant"];

/** ---------- Overloads ---------- */
export async function getOrderById(params: {
  orderId: number;
  type: "TABLE";
  variant?: OrderVariant;
}): Promise<TableOrder>;
export async function getOrderById(params: {
  orderId: number;
  type: "HOME";
  variant?: OrderVariant;
}): Promise<HomeOrder>;
export async function getOrderById(params: {
  orderId: number;
  type: "PICKUP";
  variant?: OrderVariant;
}): Promise<PickupOrder>;
export async function getOrderById(params: {
  orderId: number;
  variant?: OrderVariant;
}): Promise<OrderByType>;

export async function getOrderById({
  orderId,
  type,
  variant = "onlyPaid",
}: {
  orderId: number;
  type?: OrderType;
  variant?: OrderVariant;
}): Promise<OrderByType> {
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: { include: { ...productInOrderInclude } },
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
      table_order: true,
      ...engagementsInclude,
      ...orderPromotionUsagesInclude,
    },
  });

  if (!existingOrder) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  const filteredProducts =
    variant === "onlyPaid"
      ? existingOrder.products.filter((p) => (p.paid_quantity ?? 0) < p.quantity)
      : variant === "onlyInOrder"
        ? existingOrder.products.filter((p) => p.status === "IN_ORDER")
        : existingOrder.products;

  // Build strongly typed object based on discriminator
  let order: OrderByType;
  switch (existingOrder.type) {
    case OrderType.TABLE:
      order = {
        ...existingOrder,
        type: OrderType.TABLE,
        products: filteredProducts,
        table_order: existingOrder.table_order!,
      };
      break;
    case OrderType.HOME:
      order = {
        ...existingOrder,
        type: OrderType.HOME,
        products: filteredProducts,
        home_order: existingOrder.home_order!,
      };
      break;
    case OrderType.PICKUP:
      order = {
        ...existingOrder,
        type: OrderType.PICKUP,
        products: filteredProducts,
        pickup_order: existingOrder.pickup_order!,
      };
      break;
  }

  if (type && order.type !== type) {
    throw new Error(`Expected ${type} order but got ${order.type}`);
  }

  return order;
}
