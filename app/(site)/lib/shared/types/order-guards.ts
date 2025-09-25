import { OrderType } from "@prisma/client";
import { HomeOrder, OrderByType, PickupOrder, TableOrder } from "../models/Order";

export const OrderGuards = {
  isTable: (o: OrderByType): o is TableOrder => o.type === OrderType.TABLE,
  isHome: (o: OrderByType): o is HomeOrder => o.type === OrderType.HOME,
  isPickup: (o: OrderByType): o is PickupOrder => o.type === OrderType.PICKUP,
};
