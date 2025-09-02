import prisma from "../db";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productsInOrderInclude,
} from "../includes";
import { OrderType, PaymentType, Prisma, WorkingShift } from "@prisma/client";
import { addDays, endOfDay, parse, startOfDay } from "date-fns";
import { it } from "date-fns/locale";
import { ORDER_TYPE_LABELS } from "../../shared/constants/order-labels";
import { OrderContract, ShiftFilterValue } from "../../shared";
import normalizePeriod from "../../utils/global/date/normalizePeriod";

export default async function getOrdersWithPayments({
  filters,
  page,
  pageSize,
  summary,
}: OrderContract["Requests"]["GetOrdersWithPayments"]): Promise<
  OrderContract["Responses"]["GetOrdersWithPayments"]
> {
  const { orderTypes, shift, period, weekdays, timeWindow, query } = filters;
  const normalizedPeriod = normalizePeriod(period);

  let where: Prisma.OrderWhereInput = {
    payments: { some: {} },
  };

  if (query && query.trim() !== "") {
    let dateWhere: Prisma.OrderWhereInput = {};

    try {
      const parsed = parse(query, "d MMMM yyyy", new Date(), { locale: it });
      if (!isNaN(parsed.getTime())) {
        dateWhere = {
          created_at: {
            gte: startOfDay(parsed),
            lte: endOfDay(parsed),
          },
        };
      }
    } catch {}

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
      dateWhere,
    ];
  }

  if (orderTypes && orderTypes.length > 0) {
    where.type = { in: orderTypes };
  }

  if (shift && shift !== ShiftFilterValue.ALL) {
    where.shift = { equals: shift };
  }

  const baseFrom = normalizedPeriod?.from ?? startOfDay(new Date(2025, 0, 1));
  const baseTo = normalizedPeriod?.to ?? endOfDay(new Date());

  if (!weekdays || weekdays.length > 0) {
    const ors: Prisma.OrderWhereInput[] = [];

    const [fromH, fromM] = timeWindow ? timeWindow.from.split(":").map(Number) : [0, 0];
    const [toH, toM] = timeWindow ? timeWindow.to.split(":").map(Number) : [23, 59];

    const end = endOfDay(baseTo);

    for (let day = startOfDay(baseFrom); day <= end; day = addDays(day, 1)) {
      // 🚫 Always skip Mondays (getDay() === 1)
      if (day.getDay() === 1) continue;

      // Skip days not in selected weekdays
      if (weekdays && !weekdays.includes(day.getDay())) continue;

      const fromDate = new Date(day);
      fromDate.setHours(fromH, fromM, 0, 0);

      const toDate = new Date(day);
      toDate.setHours(toH, toM, 59, 999);

      ors.push({ created_at: { gte: fromDate, lte: toDate } });
    }

    if (ors.length) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        { OR: ors },
      ];
    }
  }

  const canPaginate = !summary && page !== undefined && pageSize !== undefined;

  const totalCount = await prisma.order.count({ where });
  const rawOrders = await prisma.order.findMany({
    where,
    include: {
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
      table_order: true,
      ...productsInOrderInclude,
      ...engagementsInclude,
    },
    orderBy: { created_at: "desc" },
    skip: canPaginate ? page * pageSize : undefined,
    take: canPaginate ? pageSize : undefined,
  });

  let filteredOrders = rawOrders;

  // 💰 Add payment totals
  const ordersWithPaymentTotals = filteredOrders.map((order) => {
    const paymentTotals = {
      totalCash: 0,
      totalCard: 0,
      totalVouch: 0,
      totalCredit: 0,
    };

    order.payments.forEach((payment) => {
      switch (payment.type) {
        case PaymentType.CARD:
          paymentTotals.totalCard += payment.amount;
          break;
        case PaymentType.CASH:
          paymentTotals.totalCash += payment.amount;
          break;
        case PaymentType.CREDIT:
          paymentTotals.totalCredit += payment.amount;
          break;
        case PaymentType.VOUCH:
          paymentTotals.totalVouch += payment.amount;
          break;
      }
    });

    return { ...order, ...paymentTotals };
  });

  return {
    orders: ordersWithPaymentTotals,
    totalCount,
  };
}
