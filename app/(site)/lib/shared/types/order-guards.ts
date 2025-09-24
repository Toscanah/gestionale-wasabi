import { HomeOrder, OrderByType, PickupOrder, TableOrder } from "../models/Order";

export const OrderGuards = {
  isTable: (o: OrderByType): o is TableOrder => o.type === "TABLE",
  isHome: (o: OrderByType): o is HomeOrder => o.type === "HOME",
  isPickup: (o: OrderByType): o is PickupOrder => o.type === "PICKUP",
};
