import { OrderType } from "@prisma/client";

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [OrderType.HOME]: "Domicilio",
  [OrderType.PICKUP]: "Asporto",
  [OrderType.TABLE]: "Tavolo",
};

export const ORDER_TYPE_COLORS: Record<OrderType, string> = {
  [OrderType.HOME]:
    "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900 dark:text-sky-200 dark:border-sky-700",
  [OrderType.PICKUP]:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700",
  [OrderType.TABLE]:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700",
};
