import { useEffect, useReducer, useState } from "react";
import { AnyOrder, ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType, ProductInOrderStatus, WorkingShift } from "@prisma/client";
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
  // Home orders
  homeOrders: number;
  homeRevenue: number;
  homeSoups: number;
  homeRices: number; // count of "rice" dishes
  homeSalads: number;
  homeRice: number; // total rice mass (e.g., grams) consumed
  homeProducts: number;

  // Pickup orders
  pickupOrders: number;
  pickupRevenue: number;
  pickupSoups: number;
  pickupRices: number;
  pickupSalads: number;
  pickupRice: number;
  pickupProducts: number;

  // Table orders
  tableOrders: number;
  tableRevenue: number;
  tableSoups: number;
  tableRices: number;
  tableSalads: number;
  tableRice: number;
  tableProducts: number;
};

export default function useOrdersStats(orders: AnyOrder[]) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);
  const DEFAULT_RESULTS = (): Results =>
    Object.fromEntries(Object.keys(initialState).map((key) => [key, 0])) as Results;

  const [filteredResults, setFilteredResults] = useState<Results>(DEFAULT_RESULTS);

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
    // Accumulators
    let homeOrders = 0,
      pickupOrders = 0,
      tableOrders = 0;

    let homeRevenue = 0,
      pickupRevenue = 0,
      tableRevenue = 0;

    let homeSoups = 0,
      homeRices = 0,
      homeSalads = 0;
    let pickupSoups = 0,
      pickupRices = 0,
      pickupSalads = 0;
    let tableSoups = 0,
      tableRices = 0,
      tableSalads = 0;

    let homeProducts = 0,
      pickupProducts = 0,
      tableProducts = 0;

    // Total rice mass (e.g., grams) per order type
    let homeRice = 0,
      pickupRice = 0,
      tableRice = 0;

    // Helpers
    const computeLineRevenue = (pio: ProductInOrder) => {
      const paidQty = pio.paid_quantity ?? 0;
      const price = pio.frozen_price ?? 0;
      return paidQty > 0 ? paidQty * price : 0;
    };

    const computeOrderRiceMass = (order: AnyOrder) => {
      if (!Array.isArray(order.products)) return 0;

      let riceMass = 0;

      for (const pio of order.products) {
        const isCooked =
          pio.status === ProductInOrderStatus.IN_ORDER ||
          pio.status === ProductInOrderStatus.DELETED_COOKED;
        const paidQty = pio.paid_quantity ?? 0;

        if (isCooked && paidQty > 0) {
          riceMass += getPioRice(pio);
        }
      }

      return riceMass;
    };

    const computeCategoryCountsFromPIOs = (order: AnyOrder) => {
      // Derive counts from product definition * ordered quantity *
      if (!Array.isArray(order.products) || order.products.length === 0) {
        return { soups: 0, rices: 0, salads: 0 };
      }

      let soups = 0,
        rices = 0,
        salads = 0;

      for (const pio of order.products) {
        const qty = pio.quantity ?? 0;
        const prod = pio.product;
        soups += (prod.soups ?? 0) * qty;
        rices += (prod.rices ?? 0) * qty;
        salads += (prod.salads ?? 0) * qty;
      }

      return { soups, rices, salads };
    };

    for (const order of orders) {
      // --- Revenue (paid items only) ---
      let orderRevenue = 0;
      let productCount = 0;
      if (Array.isArray(order.products)) {
        for (const pio of order.products) {
          orderRevenue += computeLineRevenue(pio);
          const qty = pio.paid_quantity ?? 0;
          if (qty > 0) {
            productCount += qty;
          }
        }
      }

      // --- Category counts (soups/rices/salads) ---
      // Rule: if order-level value is present and != 0, use it; otherwise derive from PIOs.
      const derived = computeCategoryCountsFromPIOs(order);

      const orderSoups = order.soups && order.soups !== 0 ? order.soups : derived.soups;
      const orderRices = order.rices && order.rices !== 0 ? order.rices : derived.rices;
      const orderSalads = order.salads && order.salads !== 0 ? order.salads : derived.salads;

      // --- Rice mass (grams) from cooked + paid lines ---
      const orderRiceMass = computeOrderRiceMass(order);

      // --- Accumulate by type ---
      switch (order.type as OrderType) {
        case OrderType.HOME:
          homeOrders += 1;
          homeRevenue += orderRevenue;
          homeSoups += orderSoups;
          homeRices += orderRices;
          homeSalads += orderSalads;
          homeRice += orderRiceMass;
          homeProducts += productCount;
          break;

        case OrderType.PICKUP:
          pickupOrders += 1;
          pickupRevenue += orderRevenue;
          pickupSoups += orderSoups;
          pickupRices += orderRices;
          pickupSalads += orderSalads;
          pickupRice += orderRiceMass;
          pickupProducts += productCount;
          break;

        case OrderType.TABLE:
          tableOrders += 1;
          tableRevenue += orderRevenue;
          tableSoups += orderSoups;
          tableRices += orderRices;
          tableSalads += orderSalads;
          tableRice += orderRiceMass;
          tableProducts += productCount;
          break;
      }
    }

    return {
      // Home
      homeOrders,
      homeRevenue,
      homeSoups,
      homeRices,
      homeSalads,
      homeRice,
      homeProducts,

      // Pickup
      pickupOrders,
      pickupRevenue,
      pickupSoups,
      pickupRices,
      pickupSalads,
      pickupRice,
      pickupProducts,

      // Table
      tableOrders,
      tableRevenue,
      tableSoups,
      tableRices,
      tableSalads,
      tableRice,
      tableProducts,
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
