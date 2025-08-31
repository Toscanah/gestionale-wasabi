import { OrderWithPaymentsAndTotals } from "@/app/(site)/lib/shared";
import { OrderType, PaymentType } from "@prisma/client";
import { getOrderTotal } from "../order-management/getOrderTotal";
import roundToCents from "../../utils/global/number/roundToCents";

export type PaymentTotals = {
  [key in PaymentType]: { label: string; total: number };
};

export interface PaymentsSummaryData {
  totals: PaymentTotals;
  inPlaceAmount: number;
  takeawayAmount: number;
  tableOrdersAmount: number;
  homeOrdersAmount: number;
  pickupOrdersAmount: number;
  tableOrdersCount: number;
  homeOrdersCount: number;
  pickupOrdersCount: number;
  customersCount: number;
  totalAmount: number;
  rawTotalAmount: number;
  centsDifference: number;
}

export const DEFAULT_SUMMARY_DATA: PaymentsSummaryData = {
  totals: {
    [PaymentType.CASH]: { label: "Contanti", total: 0 },
    [PaymentType.CARD]: { label: "Carta", total: 0 },
    [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
    [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
  },
  inPlaceAmount: 0,
  takeawayAmount: 0,
  tableOrdersAmount: 0,
  homeOrdersAmount: 0,
  pickupOrdersAmount: 0,
  customersCount: 0,
  homeOrdersCount: 0,
  pickupOrdersCount: 0,
  tableOrdersCount: 0,
  totalAmount: 0,
  rawTotalAmount: 0,
  centsDifference: 0,
};

export default function calculatePaymentsSummary(orders: OrderWithPaymentsAndTotals[]): PaymentsSummaryData {
  if (orders.length === 0) return DEFAULT_SUMMARY_DATA;

  let rawTotalAmount = 0;
  let inPlaceAmount = 0;
  let takeawayAmount = 0;
  let homeOrdersAmount = 0;
  let pickupOrdersAmount = 0;
  let tableOrdersAmount = 0;
  let customersCount = 0;
  let totalAmount = 0;
  let homeOrdersCount = 0;
  let pickupOrdersCount = 0;
  let tableOrdersCount = 0;
  let centsDifference = 0;

  const totals: PaymentTotals = {
    [PaymentType.CASH]: { label: "Contanti", total: 0 },
    [PaymentType.CARD]: { label: "Carta", total: 0 },
    [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
    [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
  };

  orders.forEach((order) => {
    const rawOrderTotal = getOrderTotal({ order, applyDiscount: false, onlyPaid: true });
    const discountedOrderTotal = getOrderTotal({ order, applyDiscount: true, onlyPaid: true });
    const paidTotal = order.payments.reduce((sum, p) => sum + p.amount, 0);

    const isCloseEnough = Math.abs(paidTotal - discountedOrderTotal) <= 0.05;
    const effectivePaidTotal = isCloseEnough ? discountedOrderTotal : paidTotal;

    if (isCloseEnough) {
      const diff = roundToCents(paidTotal - discountedOrderTotal);
      centsDifference += diff;
    }

    order.payments.forEach((payment) => {
      totals[payment.type].total += payment.amount;
    });

    totalAmount += effectivePaidTotal;
    rawTotalAmount += rawOrderTotal;

    if (order.type === OrderType.TABLE) {
      inPlaceAmount += discountedOrderTotal;
      tableOrdersAmount += discountedOrderTotal;
      customersCount += order.table_order?.people || 1;
      tableOrdersCount++;
    } else if (order.type === OrderType.HOME) {
      takeawayAmount += discountedOrderTotal;
      homeOrdersAmount += discountedOrderTotal;
      homeOrdersCount++;
    } else if (order.type === OrderType.PICKUP) {
      takeawayAmount += discountedOrderTotal;
      pickupOrdersAmount += discountedOrderTotal;
      pickupOrdersCount++;
    }
  });

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
