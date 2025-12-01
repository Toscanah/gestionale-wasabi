import { useEffect, useMemo, useReducer } from "react";
import sectionReducer, { INITIAL_STATE, SectionState } from "./sectionReducer";
import { isSameDay } from "date-fns";
import { ALL_WEEKDAYS } from "../../components/ui/filters/select/WeekdaysFilter";
import { FULL_DAY_RANGE } from "../../components/ui/filters/time/TimeWindowFilter";
import { trpc } from "@/lib/server/client";
import { OrderContracts } from "../../lib/shared";
import { OrderType } from "@/prisma/generated/client/enums";

export enum DAYS_OF_WEEK {
  TUESDAY = "Martedì",
  WEDNESDAY = "Mercoledì",
  THURSDAY = "Giovedì",
  FRIDAY = "Venerdì",
  SATURDAY = "Sabato",
  SUNDAY = "Domenica",
}

export default function useOrdersStats() {
  const [state, dispatch] = useReducer(sectionReducer, INITIAL_STATE);

  function getDisabledFlags(state: SectionState) {
    const { period, shift } = state;

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

    const disableTimeWindow = shift !== "ALL";

    return {
      weekdays: disableWeekdays,
      shift: false,
      timeWindow: disableTimeWindow,
      orderTypes: false,
      search: false,
      reset: false,
    };
  }

  const filters: NonNullable<OrderContracts.ComputeStats.Input>["filters"] = useMemo(() => {
    let period: { from: Date; to: Date } | undefined = undefined;

    if (!state.period) {
      period = undefined;
    } else if (state.period.from && (state.period.to || state.period.from)) {
      period = { from: state.period.from, to: state.period.to ?? state.period.from };
    }

    const weekdays = state.weekdays.length === ALL_WEEKDAYS.length ? undefined : state.weekdays;

    const shift = state.shift === "ALL" ? undefined : state.shift;

    const timeWindow =
      state.timeWindow.from === FULL_DAY_RANGE.from && state.timeWindow.to === FULL_DAY_RANGE.to
        ? undefined
        : state.timeWindow;

    const orderTypes =
      state.orderTypes.length === Object.entries(OrderType).length ? undefined : state.orderTypes;

    return {
      period,
      weekdays,
      shift,
      timeWindow,
      orderTypes,
    };
  }, [state]);

  const { data: dailyStats, isLoading: isDailyStatsLoading } =
    trpc.orders.computeDailyStats.useQuery({
      filters,
    });

  const { data: ordersStats, isLoading: isOrdersLoading } = trpc.orders.computeStats.useQuery(
    {
      filters,
    },
    {
      enabled: true,
    }
  );

  function isDefaultState(state: SectionState): boolean {
    const initState = INITIAL_STATE;

    const sameRange =
      state.period == undefined && initState.period == undefined
        ? true
        : state.period != undefined &&
          initState.period != undefined &&
          (state.period.from?.getTime?.() ?? undefined) ===
            (initState.period.from?.getTime?.() ?? undefined) &&
          (state.period.to?.getTime?.() ?? undefined) ===
            (initState.period.to?.getTime?.() ?? undefined);

    const sameShift = state.shift === initState.shift;
    const sameWeekdays =
      state.weekdays.length === initState.weekdays.length &&
      state.weekdays.every((w) => initState.weekdays.includes(w));

    const sameTimeRange =
      state.timeWindow.from === initState.timeWindow.from &&
      state.timeWindow.to === initState.timeWindow.to;

    const sameOrderTypes =
      state.orderTypes.length === initState.orderTypes.length &&
      state.orderTypes.every((ot) => initState.orderTypes.includes(ot));

    return sameRange && sameShift && sameWeekdays && sameTimeRange && sameOrderTypes;
  }

  return {
    state,
    showReset: !isDefaultState(state),
    dispatch,
    filteredResults: ordersStats ?? null,
    isLoading: isOrdersLoading,
    disabledFlags: getDisabledFlags(state),
    dailyStats: dailyStats ?? null,
  };
}
