import { OrderType, Prisma } from "@prisma/client";
import { ORDER_TYPE_LABELS, OrderContracts, ShiftFilterValue, STARTING_DAY } from "../../../shared";
import normalizePeriod from "../../../utils/global/date/normalizePeriod";
import { endOfDay, startOfDay } from "date-fns";

export default function buildOrderWhere(
  filters: Partial<OrderContracts.Common.Filters> | undefined
): Prisma.OrderWhereInput {
  const { orderTypes, shift, period, query } = filters ?? {};
  const normalizedPeriod = normalizePeriod(period);

  let where: Prisma.OrderWhereInput = {
    payments: { some: {} },
  };

  if (query && query.trim() !== "") {
    where.OR = [
      {
        type: {
          in:
            query.toLowerCase() === ORDER_TYPE_LABELS[OrderType.HOME].toLowerCase()
              ? ["HOME"]
              : query.toLowerCase() === ORDER_TYPE_LABELS[OrderType.PICKUP].toLowerCase()
                ? ["PICKUP"]
                : query.toLowerCase() === ORDER_TYPE_LABELS[OrderType.TABLE].toLowerCase()
                  ? ["TABLE"]
                  : undefined,
        },
      },
      {
        table_order: {
          table: { contains: query, mode: "insensitive" },
        },
      },
      {
        pickup_order: {
          name: { contains: query, mode: "insensitive" },
        },
      },
      {
        home_order: {
          address: {
            doorbell: { contains: query, mode: "insensitive" },
          },
        },
      },
    ];
  }

  if (orderTypes && orderTypes.length > 0) {
    where.type = { in: orderTypes };
  }

  if (shift && shift !== ShiftFilterValue.ALL) {
    where.shift = { equals: shift };
  }

  const baseFrom = normalizedPeriod?.from;
  const baseTo = normalizedPeriod?.to;

  if (baseFrom && baseTo) {
    where.created_at = {
      gte: startOfDay(baseFrom),
      lte: endOfDay(baseTo),
    };
  }

  return where;
}
