import { OrderType, Prisma } from "@prisma/client";
import { ORDER_TYPE_LABELS, ShiftFilterValue } from "../../../shared";
import normalizePeriod from "../../../utils/global/date/normalizePeriod";
import { endOfDay, startOfDay } from "date-fns";
import z from "zod";
import { APIFiltersSchema } from "../../../shared/schemas/common/filters/filters";

type PossibleFilters = z.infer<
  ReturnType<
    typeof APIFiltersSchema.pick<{
      orderTypes: true;
      shift: true;
      period: true;
      query: true;
    }>
  >
>;

export default function buildOrderWhere(
  filters: Partial<PossibleFilters> | undefined
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
