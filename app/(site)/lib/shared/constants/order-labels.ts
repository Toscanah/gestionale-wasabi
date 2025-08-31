import { OrderType } from "@prisma/client";

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [OrderType.HOME]: "Domicilio",
  [OrderType.PICKUP]: "Asporto",
  [OrderType.TABLE]: "Tavolo",
};
