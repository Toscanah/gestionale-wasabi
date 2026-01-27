import prisma from "../prisma";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productsInOrderInclude,
  orderPromotionUsagesInclude,
} from "../includes";
import { OrderType, PaymentType, } from "@/prisma/generated/client/enums";
import { endOfDay, parse, startOfDay } from "date-fns";
import { ORDER_TYPE_LABELS } from "@/lib/shared/constants/order-labels";
import {
  OrderContracts,
  OrderWithSummedPayments,
  ShiftFilterValue,
  STARTING_DAY,
} from "@/lib/shared";
import normalizePeriod from "@/lib/shared/utils/global/date/normalizePeriod";
import buildOrderWhere from "./util/buildOrderWhere";

export default async function getOrdersWithPayments(
  input: OrderContracts.GetWithPayments.Input
): Promise<OrderContracts.GetWithPayments.Output> {
  const { filters, pagination } = input ?? {};
  const { page, pageSize } = pagination ?? {};

  const where = buildOrderWhere(filters);

  const canPaginate = page !== undefined && pageSize !== undefined;

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
      ...orderPromotionUsagesInclude,
    },
    orderBy: { created_at: "desc" },
    skip: canPaginate ? page * pageSize : undefined,
    take: canPaginate ? pageSize : undefined,
  });

  let filteredOrders = rawOrders;

  const ordersWithPaymentTotals: OrderWithSummedPayments[] = filteredOrders.map((order) => {
    const paymentTotals = {
      summedCash: 0,
      summedCard: 0,
      summedVouch: 0,
    };

    order.payments.forEach((payment) => {
      switch (payment.type) {
        case PaymentType.CARD:
          paymentTotals.summedCard += payment.amount;
          break;
        case PaymentType.CASH:
          paymentTotals.summedCash += payment.amount;
          break;

        case PaymentType.VOUCH:
          paymentTotals.summedVouch += payment.amount;
          break;
      }
    });

    return { ...order, ...paymentTotals };
  }) as OrderWithSummedPayments[];

  return {
    orders: ordersWithPaymentTotals,
    totalCount,
  };
}
