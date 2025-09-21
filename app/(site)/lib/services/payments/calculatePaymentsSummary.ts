import { OrderType, PaymentType } from "@prisma/client";
import { getOrderTotal } from "../order-management/getOrderTotal";
import roundToCents from "../../utils/global/number/roundToCents";
import { OrderFullPaymentContext } from "../../shared";

export const DEFAULT_SUMMARY_DATA = {
  inPlaceAmount: 0,
  takeawayAmount: 0,
  tableOrdersAmount: 0,
  homeOrdersAmount: 0,
  pickupOrdersAmount: 0,
  totalAmount: 0,
  rawTotalAmount: 0,
  centsDifference: 0,
};

const TOLERANCE = 0.1;

export default function calculatePaymentsSummary(
  orders: OrderFullPaymentContext[]
): typeof DEFAULT_SUMMARY_DATA {
  if (orders.length === 0) return DEFAULT_SUMMARY_DATA;

  let rawTotalAmount = 0;
  let inPlaceAmount = 0;
  let takeawayAmount = 0;
  let homeOrdersAmount = 0;
  let pickupOrdersAmount = 0;
  let tableOrdersAmount = 0;
  let totalAmount = 0;
  let centsDifference = 0;

  orders.forEach((order) => {
    const rawOrderTotal = getOrderTotal({ order, applyDiscount: false, onlyPaid: true });
    const discountedOrderTotal = getOrderTotal({ order, applyDiscount: true, onlyPaid: true });
    const paidTotal = order.payments.reduce((sum, p) => sum + p.amount, 0);

    const isCloseEnough = Math.abs(paidTotal - discountedOrderTotal) <= TOLERANCE;
    const effectivePaidTotal = isCloseEnough ? discountedOrderTotal : paidTotal;

    if (isCloseEnough) {
      const diff = roundToCents(paidTotal - discountedOrderTotal);
      centsDifference += diff;
    }

    totalAmount += effectivePaidTotal;
    rawTotalAmount += rawOrderTotal;

    if (order.type === OrderType.TABLE) {
      inPlaceAmount += discountedOrderTotal;
      tableOrdersAmount += discountedOrderTotal;
    } else if (order.type === OrderType.HOME) {
      takeawayAmount += discountedOrderTotal;
      homeOrdersAmount += discountedOrderTotal;
    } else if (order.type === OrderType.PICKUP) {
      takeawayAmount += discountedOrderTotal;
      pickupOrdersAmount += discountedOrderTotal;
    }
  });

  return {
    inPlaceAmount,
    takeawayAmount,
    homeOrdersAmount,
    pickupOrdersAmount,
    tableOrdersAmount,
    totalAmount,
    rawTotalAmount,
    centsDifference,
  };
}
