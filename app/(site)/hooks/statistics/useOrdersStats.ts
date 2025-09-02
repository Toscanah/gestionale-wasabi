import { useMemo, useReducer } from "react";
import sectionReducer, { INITIAL_STATE, SectionState } from "./sectionReducer";
import { useQuery } from "@tanstack/react-query";
import fetchRequest from "../../lib/api/fetchRequest";
import { isSameDay } from "date-fns";
import calculateResults from "../../lib/services/order-management/calculateOrderStats";
import { ALL_WEEKDAYS } from "../../components/ui/filters/select/WeekdaysFilter";
import { FULL_DAY_RANGE } from "../../components/ui/filters/time/TimeWindowFilter";
import { OrderContract } from "../../lib/shared";

export enum DAYS_OF_WEEK {
  TUESDAY = "Martedì",
  WEDNESDAY = "Mercoledì",
  THURSDAY = "Giovedì",
  FRIDAY = "Venerdì",
  SATURDAY = "Sabato",
  SUNDAY = "Domenica",
}

export type OrderStatsResults = {
  // Home orders
  homeOrders: number;
  homeRevenue: number;
  homeProducts: number;
  homeSoups: number;
  homeRices: number; // count of "rice" dishes
  homeSalads: number;
  homeRice: number; // total rice mass (e.g., grams) consumed

  // Pickup orders
  pickupOrders: number;
  pickupRevenue: number;
  pickupProducts: number;
  pickupSoups: number;
  pickupRices: number;
  pickupSalads: number;
  pickupRice: number;

  // Table orders
  tableOrders: number;
  tableRevenue: number;
  tableProducts: number;
  tableSoups: number;
  tableRices: number;
  tableSalads: number;
  tableRice: number;

  // Per day stats
  homeOrdersPerDay: number;
  homeRevenuePerDay: number;
  homeProductsPerDay: number;

  pickupOrdersPerDay: number;
  pickupRevenuePerDay: number;
  pickupProductsPerDay: number;

  tableOrdersPerDay: number;
  tableRevenuePerDay: number;
  tableProductsPerDay: number;

  // Averages per order
  homeRevenuePerOrder: number;
  pickupRevenuePerOrder: number;
  tableRevenuePerOrder: number;

  // ---- Averages per day (extra categories) ----
  homeSoupsPerDay: number;
  homeRicesPerDay: number;
  homeSaladsPerDay: number;
  homeRiceMassPerDay: number;

  pickupSoupsPerDay: number;
  pickupRicesPerDay: number;
  pickupSaladsPerDay: number;
  pickupRiceMassPerDay: number;

  tableSoupsPerDay: number;
  tableRicesPerDay: number;
  tableSaladsPerDay: number;
  tableRiceMassPerDay: number;
};

export default function useOrdersStats() {
  const [state, dispatch] = useReducer(sectionReducer, INITIAL_STATE);

  // TODO: decidere dove mettere sta roba nel posto giusto
  function getDisabledFlags(state: SectionState) {
    const { period, shift } = state;

    // ----- WEEKDAYS
    let disableWeekdays = false;
    if (period?.from && period?.to) {
      if (isSameDay(period.from, period.to)) {
        disableWeekdays = true; // single day
      }
    } else if (!period?.from && !period?.to) {
      disableWeekdays = false; // "Da sempre"
    } else if (period?.from && !period?.to) {
      disableWeekdays = true; // single day
    }

    // ----- TIME RANGE
    const disableTimeWindow = shift !== "ALL";

    return {
      weekdays: disableWeekdays,
      shift: false,
      timeWindow: disableTimeWindow,
      type: false,
      search: false,
      reset: false,
    };
  }

  const filters: OrderContract["Requests"]["GetOrdersWithPayments"]["filters"] = useMemo(() => {
    let period: { from: Date; to: Date } | undefined = undefined;

    if (!state.period) {
      period = undefined;
    } else if (state.period.from && (state.period.to || state.period.from)) {
      // If only from is set, use it for both from and to
      period = { from: state.period.from, to: state.period.to ?? state.period.from };
    }

    // Weekdays
    const weekdays = state.weekdays.length === ALL_WEEKDAYS.length ? undefined : state.weekdays;

    // Shift
    const shift = state.shift === "ALL" ? undefined : state.shift;

    // TimeRange
    const timeWindow =
      state.timeWindow.from === FULL_DAY_RANGE.from && state.timeWindow.to === FULL_DAY_RANGE.to
        ? undefined
        : state.timeWindow;

    return {
      period,
      weekdays,
      shift,
      timeWindow,
    };
  }, [state]);

  const { data: shiftBackfill, isLoading: isShiftBackfillLoading } = useQuery({
    queryKey: ["shiftBackfill"],
    queryFn: () => fetchRequest("PATCH", "/api/orders", "updateOrdersShift"),
    staleTime: Infinity,
    // enabled: false,
  });

  const { data, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orders", filters],
    queryFn: async (): Promise<OrderContract["Responses"]["GetOrdersWithPayments"]> =>
      fetchRequest("POST", "/api/orders", "getOrdersWithPayments", {
        filters,
        summary: true,
      }),
    enabled: !!shiftBackfill,
    // enabled: true,
    select: (res) => calculateResults(res.orders, state.period),
  });

  function isDefaultState(state: SectionState): boolean {
    const init_state = INITIAL_STATE;

    const sameRange =
      state.period == undefined && init_state.period == undefined
        ? true
        : state.period != undefined &&
          init_state.period != undefined &&
          (state.period.from?.getTime?.() ?? undefined) ===
            (init_state.period.from?.getTime?.() ?? undefined) &&
          (state.period.to?.getTime?.() ?? undefined) ===
            (init_state.period.to?.getTime?.() ?? undefined);

    const sameShift = state.shift === init_state.shift;
    const sameWeekdays =
      state.weekdays.length === init_state.weekdays.length &&
      state.weekdays.every((w) => init_state.weekdays.includes(w));

    const sameTimeRange =
      state.timeWindow.from === init_state.timeWindow.from &&
      state.timeWindow.to === init_state.timeWindow.to;

    return sameRange && sameShift && sameWeekdays && sameTimeRange;
  }

  return {
    state,
    showReset: !isDefaultState(state),
    dispatch,
    filteredResults: data ?? null,
    isLoading: isOrdersLoading || isShiftBackfillLoading,
    disabledFlags: getDisabledFlags(state),
  };
}
