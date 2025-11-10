import prisma from "../prisma";
import { PaymentContracts, OrderContracts } from "../../shared";
import { OrderType, PaymentType, Prisma } from "@prisma/client";
import calculatePaymentsSummary from "../../services/payments/calculatePaymentsSummary";
import { productsInOrderInclude } from "../includes";
import buildOrderWhere from "../orders/util/buildOrderWhere";

export default async function getPaymentsSummary(
  input: PaymentContracts.GetSummary.Input
): Promise<PaymentContracts.GetSummary.Output> {
  const { filters } = input ?? {};

  const where = buildOrderWhere(filters);

  // 🔹 Prisma aggregations
  const [paymentsByType, ordersByType, tablePeopleSum, filteredOrders] = await Promise.all([
    prisma.payment.groupBy({
      by: ["type"],
      _sum: { amount: true },
      where: { order: where },
    }),
    prisma.order.groupBy({
      by: ["type"],
      _count: { _all: true },
      where,
    }),
    prisma.tableOrder.aggregate({
      _sum: { people: true },
      where: { order: { ...where, type: "TABLE" } },
    }),
    prisma.order.findMany({
      where,
      include: {
        payments: true,
        table_order: true,
        ...productsInOrderInclude,
      },
    }),
  ]);

  // 🔹 Build totals map
  const totals: PaymentContracts.GetSummary.Output["totals"] = {
    [PaymentType.CASH]: { label: "Contanti", total: 0 },
    [PaymentType.CARD]: { label: "Carta", total: 0 },
    [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
    [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
    [PaymentType.PROMOTION]: { label: "Promozioni", total: 0 },
  };
  paymentsByType.forEach((p) => {
    totals[p.type].total = p._sum.amount ?? 0;
  });

  // 🔹 Counts by type
  const countsMap: Record<OrderType, number> = {
    TABLE: 0,
    HOME: 0,
    PICKUP: 0,
  };

  ordersByType.forEach((o) => {
    countsMap[o.type as OrderType] = o._count._all;
  });

  const tableOrdersCount = countsMap.TABLE ?? 0;
  const homeOrdersCount = countsMap.HOME ?? 0;
  const pickupOrdersCount = countsMap.PICKUP ?? 0;

  // 🔹 Customers count
  let customersCount = tablePeopleSum._sum.people ?? 0;
  // add 1 per non-table order
  customersCount += homeOrdersCount + pickupOrdersCount;

  // 🔹 Handle totals/discounts/tolerance Node side
  const {
    rawTotalAmount,
    totalAmount,
    centsDifference,
    inPlaceAmount,
    takeawayAmount,
    homeOrdersAmount,
    pickupOrdersAmount,
    tableOrdersAmount,
  } = calculatePaymentsSummary(filteredOrders); // reuse your old function but strip it down to only what's still needed

  return {
    totals,
    inPlaceAmount,
    takeawayAmount,
    homeOrdersAmount,
    pickupOrdersAmount,
    tableOrdersAmount,
    customersCount,
    homeOrdersCount,
    pickupOrdersCount,
    tableOrdersCount,
    totalAmount,
    rawTotalAmount,
    centsDifference,
  };
}
