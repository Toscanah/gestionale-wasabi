import { useEffect, useReducer, useState } from "react";
import { AnyOrder, HomeOrder, PickupOrder } from "../../models";
import { OrderType, ProductInOrderState, WorkingShift } from "@prisma/client";
import { DateRange } from "react-day-picker";
import sectionReducer, { initialState } from "./sectionReducer";
import { isSameDay } from "date-fns";
import useSettings from "../useSettings";
import getWhenOfOrder from "../../functions/order-management/getWhenOfOrder";
import timeToDecimal from "../../functions/util/timeToDecimal";
import getEffectiveOrderTime from "../../functions/order-management/getEffectiveOrderTime";

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

type Results = {
  homeOrders: number;
  pickupOrders: number;
  tableOrders: number;
  totalRiceConsumed: number;
  // avgPerHour: number;
};

export default function useOrdersStats(orders: AnyOrder[]) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);
  const [filteredResults, setFilteredResults] = useState<Results>({
    homeOrders: 0,
    pickupOrders: 0,
    tableOrders: 0,
    totalRiceConsumed: 0,
    // avgPerHour: 0,
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

    // These are the default shift hour ranges for fallback inference
    const LUNCH_START = 10.0; // 10:00
    const LUNCH_END = 14.5; // 14:30
    const DINNER_START = 14.5; // 14:30
    const DINNER_END = 22.5; // 22:30

    const inferShiftFromTime = (order: AnyOrder): WorkingShift => {
      const { time } = getEffectiveOrderTime(order);

      if (time >= LUNCH_START && time <= LUNCH_END) return WorkingShift.LUNCH;
      if (time > LUNCH_END && time <= DINNER_END) return WorkingShift.DINNER;

      return WorkingShift.UNSPECIFIED;
    };

    // Shift-based filtering (e.g., LUNCH / DINNER / ALL)
    if (state.time.type === "shift") {
      return orders.filter((order) => {
        const effectiveShift =
          order.shift === WorkingShift.UNSPECIFIED ? inferShiftFromTime(order) : order.shift;

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
        const { time } = getEffectiveOrderTime(order);
        return time >= fromHour && time <= toHour;
      });
    }

    return orders;
  };

  const calculateResults = (orders: AnyOrder[]) => {
    const homeOrders = orders.filter((order) => order.type === OrderType.HOME).length;
    const pickupOrders = orders.filter((order) => order.type === OrderType.PICKUP).length;
    const tableOrders = orders.filter((order) => order.type === OrderType.TABLE).length;
    const totalRiceConsumed = orders.reduce((sum, order) => {
      return (
        sum +
        order.products.reduce((prodSum, product) => {
          const shouldCount =
            product.state === ProductInOrderState.IN_ORDER ||
            product.state === ProductInOrderState.DELETED_COOKED;
          return prodSum + (shouldCount ? product.rice_quantity || 0 : 0);
        }, 0)
      );
    }, 0);

    return {
      homeOrders,
      pickupOrders,
      tableOrders,
      totalRiceConsumed,
      // avgPerHour: 0, // Uncomment if avgPerHour is needed
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
