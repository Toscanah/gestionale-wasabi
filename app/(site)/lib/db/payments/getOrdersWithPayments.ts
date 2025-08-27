import { OrderWithPayments, PaymentSchemaInputs } from "@/app/(site)/lib/shared";
import prisma from "../db";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productsInOrderInclude,
} from "../includes";
import { PaymentType, OrderType, Prisma } from "@prisma/client";
import orderMatchesShift from "@/app/(site)/lib/services/order-management/shift/orderMatchesShift";
import { endOfDay, parse, startOfDay } from "date-fns";
import { it } from "date-fns/locale";

export default async function getOrdersWithPayments({
  filters,
  page,
  pageSize,
  summary,
}: PaymentSchemaInputs["GetOrdersWithPaymentsInput"]): Promise<{
  orders: OrderWithPayments[];
  totalCount: number;
}> {
  const { type, shift, timeScope, singleDate, rangeDate, search = "" } = filters;

  let where: Prisma.OrderWhereInput = {
    payments: { some: {} },
  };

  if (search && search.trim() !== "") {
    let dateWhere: Prisma.OrderWhereInput = {};
    try {
      const parsed = parse(search, "d MMMM yyyy", new Date(), { locale: it });
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
          equals:
            search?.toLowerCase() === "domicilio"
              ? OrderType.HOME
              : search?.toLowerCase() === "asporto"
              ? OrderType.PICKUP
              : search?.toLowerCase() === "tavolo"
              ? OrderType.TABLE
              : undefined,
        },
      },
      {
        table_order: {
          table: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        pickup_order: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        home_order: {
          address: {
            doorbell: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      dateWhere,
    ];
  }

  if (type && Object.values(OrderType).includes(type)) {
    where.type = type;
  }

  if (timeScope === "single" && singleDate) {
    where.created_at = {
      gte: startOfDay(singleDate),
      lte: endOfDay(singleDate),
    };
  } else if (timeScope === "range" && rangeDate) {
    where.created_at = {
      gte: startOfDay(rangeDate.from),
      lte: endOfDay(rangeDate.to),
    };
  }

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
    skip: summary ? undefined : page * pageSize,
    take: summary ? undefined : pageSize,
  });

  const orders = shift ? rawOrders.filter((order) => orderMatchesShift(order, shift)) : rawOrders;

  const ordersWithPaymentTotals = orders.map((order) => {
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

    return {
      ...order,
      ...paymentTotals,
    };
  });

  return {
    orders: ordersWithPaymentTotals,
    totalCount,
  };
}
