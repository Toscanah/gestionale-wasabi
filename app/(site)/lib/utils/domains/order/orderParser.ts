import { OrderType } from "@prisma/client";
import { OrderByType, TableOrder, HomeOrder, PickupOrder } from "@/app/(site)/lib/shared";

export function isTableOrder(order: OrderByType): order is TableOrder {
  return order.type === OrderType.TABLE;
}

export function isHomeOrder(order: OrderByType): order is HomeOrder {
  return order.type === OrderType.HOME;
}

export function isPickupOrder(order: OrderByType): order is PickupOrder {
  return order.type === OrderType.PICKUP;
}
