import { useCallback, useEffect, useState } from "react";
import { OrderWithPayments } from "@/app/(site)/lib/shared";
import fetchRequest from "../lib/core/fetchRequest";
import { OrderType, PaymentType } from "@prisma/client";
import { getOrderTotal } from "../lib/services/order-management/getOrderTotal";
import roundToCents from "../lib/utils/roundToCents";
import { ShiftFilter } from "../lib/shared/types/ShiftFilter";
import orderMatchesShift from "../lib/services/order-management/shift/orderMatchesShift";
import { DateRange } from "react-day-picker";
import { isSameDay } from "date-fns";

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
  totalAmount: number; // discounted
  rawTotalAmount: number; // new field!
  centsDifference: number;
}

const DEFAULT_SUMMARY_DATA: PaymentsSummaryData = {
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

export default function usePaymentsHistory() {
  const [summaryData, setSummaryData] = useState<PaymentsSummaryData>(DEFAULT_SUMMARY_DATA);
  const [allOrders, setAllOrders] = useState<OrderWithPayments[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithPayments[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>(ShiftFilter.BOTH);

  const [timeScope, setTimeScope] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInitialOrders = () => {
    setIsLoading(true);
    fetchRequest<OrderWithPayments[]>("GET", "/api/payments", "getOrdersWithPayments")
      .then((orders) => setAllOrders(orders))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInitialOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [allOrders, singleDate, rangeDate, timeScope, typeFilter, shiftFilter]);

  const filterOrders = useCallback(() => {
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.created_at);
      let matchesDate = true;

      if (timeScope === "single" && singleDate) {
        matchesDate = isSameDay(orderDate, singleDate);
      } else if (timeScope === "range" && rangeDate?.from && rangeDate?.to) {
        const from = new Date(rangeDate.from.setHours(0, 0, 0, 0));
        const to = new Date(rangeDate.to.setHours(23, 59, 59, 999));
        matchesDate = orderDate >= from && orderDate <= to;
      }

      const matchesType = typeFilter === "all" || order.type === typeFilter;

      return matchesDate && matchesType && orderMatchesShift(order, shiftFilter);
    });

    setFilteredOrders(filtered);
  }, [allOrders, singleDate, rangeDate, timeScope, typeFilter, shiftFilter]);

  const resetFilters = () => {
    setSingleDate(new Date());
    setTypeFilter("all");
    setShiftFilter(ShiftFilter.BOTH);
    filterOrders();
    setTimeScope("single");
    setRangeDate(undefined);
    setSingleDate(new Date());
  };

  useEffect(() => {
    if (filteredOrders.length > 0) {
      calculateSummaryData(filteredOrders);
    } else {
      setSummaryData(DEFAULT_SUMMARY_DATA);
    }
  }, [filteredOrders]);

  const calculateSummaryData = (orders: OrderWithPayments[]) => {
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

    const newTotals: PaymentTotals = {
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

      // Track cent difference if it's "close enough"
      if (isCloseEnough) {
        const diff = roundToCents(paidTotal - discountedOrderTotal);
        centsDifference += diff;
      }

      order.payments.forEach((payment) => {
        newTotals[payment.type].total += payment.amount;
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

    setSummaryData({
      totals: newTotals,
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
    });
  };

  return {
    filteredOrders,
    isLoading,
    typeFilter,
    setTypeFilter,
    resetFilters,
    singleDate,
    setSingleDate,
    shiftFilter,
    setShiftFilter,
    summaryData,
    allOrders,
    timeScope,
    setTimeScope,
    rangeDate,
    setRangeDate,
  };
}
