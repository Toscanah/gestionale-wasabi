import { OrderType } from "@/prisma/generated/client/enums";

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [OrderType.HOME]: "Domicilio",
  [OrderType.PICKUP]: "Asporto",
  [OrderType.TABLE]: "Tavolo",
};

export const ORDER_TYPE_COLORS: Record<OrderType, string> = {
  [OrderType.HOME]:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  [OrderType.PICKUP]:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
  [OrderType.TABLE]:
    "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700",
};
