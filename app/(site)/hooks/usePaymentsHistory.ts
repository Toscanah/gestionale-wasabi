import { useCallback, useEffect, useState } from "react";
import { OrderWithPayments } from "@shared";
import fetchRequest from "../lib/api/fetchRequest";
import { isSameDay } from "date-fns";
import { ShiftFilter } from "../components/filters/shift/ShiftFilterSelector";
import { orderMatchesShift } from "../lib/order-management/shift/orderMatchesShift";
import { OrderType, PaymentType } from "@prisma/client";
import { getOrderTotal } from "../lib/order-management/getOrderTotal";

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
};

export default function usePaymentsHistory() {
  const [allOrders, setAllOrders] = useState<OrderWithPayments[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithPayments[]>([]);

  const [summaryData, setSummaryData] = useState<PaymentsSummaryData>(DEFAULT_SUMMARY_DATA);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>(ShiftFilter.BOTH);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInitialOrders = () => {
    setIsLoading(true);
    fetchRequest<OrderWithPayments[]>("GET", "/api/payments", "getOrdersWithPayments")
      .then((orders) => {
        setAllOrders(orders);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInitialOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [allOrders, date, typeFilter, shiftFilter]);

  const filterOrders = useCallback(() => {
    const filtered = allOrders.filter((order) => {
      const matchesDate = date ? isSameDay(new Date(order.created_at), date) : true;
      const matchesType = typeFilter === "all" || order.type === typeFilter;

      return matchesDate && matchesType && orderMatchesShift(order, shiftFilter);
    });

    setFilteredOrders(filtered);
  }, [allOrders, date, typeFilter, shiftFilter]);

  const resetFilters = () => {
    setDate(new Date());
    setTypeFilter("all");
    setShiftFilter(ShiftFilter.BOTH);
    filterOrders();
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

    const newTotals: PaymentTotals = {
      [PaymentType.CASH]: { label: "Contanti", total: 0 },
      [PaymentType.CARD]: { label: "Carta", total: 0 },
      [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
      [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
    };

    orders.forEach((order) => {
      // Payments: reflect what was actually paid
      order.payments.forEach((payment) => {
        newTotals[payment.type].total += payment.amount;
        totalAmount += payment.amount; // discounted (actual) money
      });

      // Get both raw and discounted totals
      const rawOrderTotal = getOrderTotal({ order, applyDiscount: false });
      const discountedOrderTotal = getOrderTotal({ order, applyDiscount: true });

      rawTotalAmount += rawOrderTotal;

      // Assign to correct category
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
    });
  };

  return {
    filteredOrders,
    isLoading,
    typeFilter,
    setTypeFilter,
    resetFilters,
    date,
    setDate,
    shiftFilter,
    setShiftFilter,
    summaryData,
    allOrders,
  };
}
