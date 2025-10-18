import { useEffect, useMemo, useReducer } from "react";
import sectionReducer, { INITIAL_STATE, SectionState } from "./sectionReducer";
import { isSameDay } from "date-fns";
import { ALL_WEEKDAYS } from "../../components/ui/filters/select/WeekdaysFilter";
import { FULL_DAY_RANGE } from "../../components/ui/filters/time/TimeWindowFilter";
import { trpc } from "@/lib/server/client";
import { OrderContracts } from "../../lib/shared";

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
      type: false,
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

    return {
      period,
      weekdays,
      shift,
      timeWindow,
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
    filteredResults: ordersStats ?? null,
    isLoading: isOrdersLoading,
    disabledFlags: getDisabledFlags(state),
    dailyStats: dailyStats ?? null,
  };
}
