import { useEffect, useReducer, useState } from "react";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { OrderType, ProductInOrderState, WorkingShift } from "@prisma/client";
import { DateRange } from "react-day-picker";
import sectionReducer, { initialState } from "./sectionReducer";
import { isSameDay } from "date-fns";
import timeToDecimal from "../../lib/utils/time/timeToDecimal";
import {
  getEffectiveOrderShift,
  parseOrderTime,
} from "../../lib/services/order-management/shift/getEffectiveOrderShift";
import getPioRice from "../../lib/services/product-management/getPioRice";

export enum DAYS_OF_WEEK {
  TUESDAY = "Martedì",
  WEDNESDAY = "Mercoledì",
  THURSDAY = "Giovedì",
  FRIDAY = "Venerdì",
  SATURDAY = "Sabato",
  SUNDAY = "Domenica",
}

export type WeekdaysOrDateChoice = "weekdays" | "date";

export type WeekdaysSelection =
  | { type: "year"; year: string }
  | { type: "range"; range: DateRange | undefined };

export type Shift = "lunch" | "dinner" | "all";

export type Time = { type: "shift"; shift: Shift } | { type: "range"; from: string; to: string };

export type Results = {
  homeOrders: number;
  pickupOrders: number;
  tableOrders: number;
  totalRiceConsumed: number;
  totalProducts: number;
  totalFromProducts: number;
};

export default function useOrdersStats(orders: AnyOrder[]) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);
  const [filteredResults, setFilteredResults] = useState<Results>({
    homeOrders: 0,
    pickupOrders: 0,
    tableOrders: 0,
    totalRiceConsumed: 0,
    totalProducts: 0,
    totalFromProducts: 0,
  });

  const weekdayMap = {
    [DAYS_OF_WEEK.TUESDAY]: 2,
    [DAYS_OF_WEEK.WEDNESDAY]: 3,
    [DAYS_OF_WEEK.THURSDAY]: 4,
    [DAYS_OF_WEEK.FRIDAY]: 5,
    [DAYS_OF_WEEK.SATURDAY]: 6,
    [DAYS_OF_WEEK.SUNDAY]: 0,
  };

  const filterByDate = (orders: AnyOrder[]): AnyOrder[] => {
    if (state.mainChoice === "weekdays" && state.weekdays?.length) {
      const selectedWeekdays = state.weekdays.map((day) => weekdayMap[day]);
      let filtered = orders.filter((order) =>
        selectedWeekdays.includes(new Date(order.created_at).getDay())
      );

      if (
        state.weekdaysSelection?.type === "range" &&
        state.weekdaysSelection.range?.from &&
        state.weekdaysSelection.range?.to
      ) {
        const start = new Date(state.weekdaysSelection.range.from);
        const end = new Date(state.weekdaysSelection.range.to);
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= start && orderDate <= end;
        });
      } else if (state.weekdaysSelection?.type === "year" && state.weekdaysSelection.year) {
        const selectedYear = Number(state.weekdaysSelection.year);
        filtered = filtered.filter((order) => {
          const orderYear = new Date(order.created_at).getFullYear();
          return orderYear === selectedYear;
        });
      }

      return filtered;
    }

    if (state.mainChoice === "date" && state.specificDate) {
      const specificDate = new Date(state.specificDate);
      return orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return isSameDay(orderDate, specificDate);
      });
    }

    return orders;
  };

  const filterByTime = (orders: AnyOrder[]): AnyOrder[] => {
    if (!state.time) return orders;

    // Shift-based filtering (e.g., LUNCH / DINNER / ALL)
    if (state.time.type === "shift") {
      return orders.filter((order) => {
        const { effectiveShift } = getEffectiveOrderShift(order);

        if (state.time.type === "shift" && state.time.shift === "lunch")
          return effectiveShift === WorkingShift.LUNCH;

        if (state.time.type === "shift" && state.time.shift === "dinner")
          return effectiveShift === WorkingShift.DINNER;

        return effectiveShift === WorkingShift.LUNCH || effectiveShift === WorkingShift.DINNER;
      });
    }

    // Range-based filtering (by hours)
    if (state.time.type === "range" && state.time.from && state.time.to) {
      const fromHour = timeToDecimal(new Date(`1970-01-01T${state.time.from}`));
      const toHour = timeToDecimal(new Date(`1970-01-01T${state.time.to}`));

      return orders.filter((order) => {
        const time = parseOrderTime(order);
        return time >= fromHour && time <= toHour;
      });
    }

    return orders;
  };

  const calculateResults = (orders: AnyOrder[]): Results => {
    let homeOrders = 0;
    let pickupOrders = 0;
    let tableOrders = 0;
    let totalRiceConsumed = 0;
    let totalProducts = 0;
    let totalFromProducts = 0;

    for (const order of orders) {
      if (order.type === OrderType.HOME) homeOrders++;
      if (order.type === OrderType.PICKUP) pickupOrders++;
      if (order.type === OrderType.TABLE) tableOrders++;

      for (const product of order.products) {
        const isCooked =
          product.state === ProductInOrderState.IN_ORDER ||
          product.state === ProductInOrderState.DELETED_COOKED;

        const paidQty = product.paid_quantity ?? 0;
        const qty = product.quantity ?? 0;
        const frozenPrice = product.frozen_price ?? 0;

        if (isCooked && paidQty > 0) {
          totalRiceConsumed += getPioRice(product);
        }

        totalProducts += qty;
        totalFromProducts += qty * frozenPrice;
      }
    }

    return {
      homeOrders,
      pickupOrders,
      tableOrders,
      totalRiceConsumed,
      totalProducts,
      totalFromProducts,
    };
  };

  const applyFilters = () => {
    let filteredOrders = [...orders];
    filteredOrders = filterByDate(filteredOrders);
    filteredOrders = filterByTime(filteredOrders);
    setFilteredResults(calculateResults(filteredOrders));
  };

  const isFiltersValid = () => {
    const hasValidWeekdaysSelection =
      state.mainChoice === "weekdays" &&
      !!state.weekdays?.length &&
      ((state.weekdaysSelection?.type === "range" &&
        state.weekdaysSelection.range?.from &&
        state.weekdaysSelection.range?.to) ||
        (state.weekdaysSelection?.type === "year" && state.weekdaysSelection.year));

    const hasValidSpecificDate = state.mainChoice === "date" && !!state.specificDate;

    const hasValidTime =
      state.time.type === "shift" ||
      (state.time.type === "range" && !!state.time.from && !!state.time.to);

    return (hasValidWeekdaysSelection || hasValidSpecificDate) && hasValidTime;
  };

  useEffect(applyFilters, [
    state.mainChoice,
    state.weekdays,
    state.weekdaysSelection,
    state.specificDate,
    state.time,
  ]);

  return {
    state,
    dispatch,
    filteredResults,
    isFiltersValid,
  };
}
