import { useEffect, useReducer, useState } from "react";
import { AnyOrder } from "../../models";
import { OrderType } from "@prisma/client";
import { DateRange } from "react-day-picker";
import sectionReducer, { initialState } from "./sectionReducer";
import { isSameDay } from "date-fns";
import useSettings from "../useSettings";

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
  const { settings } = useSettings();
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

    if (state.time.type === "shift") {
      const timeToDecimal = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number); // Split the time into hours and minutes and convert to numbers
        return hours + minutes / 60; // Convert to decimal (e.g., 12:30 becomes 12.5)
      };

      // const lunchStart = timeToDecimal(settings.businessHours.lunch.opening);
      // const lunchEnd = timeToDecimal(settings.businessHours.lunch.closing);
      // const dinnerStart = timeToDecimal(settings.businessHours.dinner.opening);
      // const dinnerEnd = timeToDecimal(settings.businessHours.dinner.closing);

      const lunchStart = 0;
      const lunchEnd = 24;
      const dinnerStart = 0;
      const dinnerEnd = 24;

      return orders.filter((order) => {
        const orderHour = new Date(order.created_at).getHours();
        return (
          (state.time.type === "shift" &&
            state.time.shift === "lunch" &&
            orderHour >= lunchStart &&
            orderHour < lunchEnd) ||
          (state.time.type === "shift" &&
            state.time.shift === "dinner" &&
            orderHour >= dinnerStart &&
            orderHour < dinnerEnd) ||
          (state.time.type === "shift" &&
            state.time.shift === "all" &&
            ((orderHour >= lunchStart && orderHour < lunchEnd) ||
              (orderHour >= dinnerStart && orderHour < dinnerEnd)))
        );
      });
    }

    if (state.time.type === "range" && state.time.from && state.time.to) {
      const timeStart = new Date(`1970-01-01T${state.time.from}`).getHours();
      const timeEnd = new Date(`1970-01-01T${state.time.to}`).getHours();

      return orders.filter((order) => {
        const orderHour = new Date(order.created_at).getHours();
        return orderHour >= timeStart && orderHour <= timeEnd;
      });
    }

    return orders;
  };

  const calculateResults = (orders: AnyOrder[]) => {
    const homeOrders = orders.filter((order) => order.type === OrderType.HOME).length;
    const pickupOrders = orders.filter((order) => order.type === OrderType.PICKUP).length;
    const tableOrders = orders.filter((order) => order.type === OrderType.TABLE).length;
    const totalRiceConsumed = orders.reduce(
      (sum, order) =>
        sum +
        order.products.reduce((prodSum, product) => prodSum + (product.rice_quantity || 0), 0),
      0
    );

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
