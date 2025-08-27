import { useMemo, useReducer } from "react";
import { DateRange } from "react-day-picker";
import sectionReducer, { initialState } from "./sectionReducer";
import { useQuery } from "@tanstack/react-query";
import fetchRequest from "../../lib/api/fetchRequest";
import { PaymentSchemaInputs } from "../../lib/shared";
import { ShiftType } from "../../lib/shared/enums/Shift";

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

export default function useOrdersStats() {
  const [state, dispatch] = useReducer(sectionReducer, initialState);

  const filters: PaymentSchemaInputs["GetOrdersWithPaymentsInput"]["filters"] = useMemo(() => {
    let timeScope: "single" | "range" = "single";
    let singleDate: Date | undefined;
    let rangeDate: { from: Date; to: Date } | undefined;

    if (state.mainChoice === "date" && state.specificDate) {
      timeScope = "single";
      singleDate = state.specificDate;
    } else if (
      state.mainChoice === "weekdays" &&
      state.weekdaysSelection?.type === "range" &&
      state.weekdaysSelection.range?.from &&
      state.weekdaysSelection.range?.to
    ) {
      timeScope = "range";
      rangeDate = {
        from: state.weekdaysSelection.range.from,
        to: state.weekdaysSelection.range.to,
      };
    } else if (state.mainChoice === "weekdays" && state.weekdaysSelection?.type === "year") {
      // could be modeled as a range covering the whole year
      const year = Number(state.weekdaysSelection.year);
      timeScope = "range";
      rangeDate = {
        from: new Date(year, 0, 1),
        to: new Date(year, 11, 31, 23, 59, 59),
      };
    }

    // map shift / time range
    let shift: ShiftType | undefined;
    if (state.time?.type === "shift") {
      if (state.time.shift === "lunch") shift = ShiftType.LUNCH;
      if (state.time.shift === "dinner") shift = ShiftType.DINNER;
    }
    // if it's a range, you’d need to decide how/if that maps to backend — maybe extend schema later

    return {
      timeScope,
      singleDate,
      rangeDate,
      shift,
      search: "", // not used in stats
    };
  }, [state]);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", filters],
    queryFn: async (): Promise<any> => {}
      // await fetchRequest<any>("GET", "/api/payments", "getOrdersWithPayments", {
      //   filters,
      // }),
  });

  // const filteredResults = useMemo(() => calculateResults(orders), [orders]);

  return {
    state,
    dispatch,
    // filteredResults,
    isLoading,
    isError,
  };
}
