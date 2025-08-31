import { DateRange } from "react-day-picker";
import useOrdersStats from "../../../hooks/statistics/useOrdersStats";
import { ReducerActions } from "../../../hooks/statistics/sectionReducer";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import WeekdaysFilter from "../../../components/ui/filters/select/WeekdaysFilter";
import OrderTypesFilter from "../../../components/ui/filters/select/OrderTypesFilter";
import TimeWindowFilter from "@/app/(site)/components/ui/filters/time/TimeWindowFilter";
import SectionResults from "./results/SectionResults";
import { Separator } from "@/components/ui/separator";
import ResetFiltersButton from "@/app/(site)/components/ui/filters/common/ResetFiltersButton";

interface SectionProps {
  id: string;
}

export type SelectionProps<T> = {
  selection: T;
  dispatch: React.Dispatch<ReducerActions>;
};

export default function Section({}: SectionProps) {
  const { dispatch, state, disabledFlags, filteredResults, showReset, isLoading } =
    useOrdersStats();

  const years = Array.from({ length: new Date().getFullYear() - 2025 + 1 }, (_, i) => 2025 + i);

  return (
    <div className="flex flex-col gap-4 w-full p-4 h-full">
      <div className="w-full flex gap-4">
        <CalendarFilter
          usePresets
          years={years}
          mode="range"
          dateFilter={state.period}
          handleDateFilter={(newDate) =>
            dispatch({ type: "SET_PERIOD", payload: newDate as DateRange })
          }
        />

        <WeekdaysFilter
          weekdays={state.weekdays}
          onWeekdaysChange={(updatedWeekdays) =>
            dispatch({
              type: "SET_WEEKDAYS",
              payload: updatedWeekdays,
            })
          }
          disabled={disabledFlags.weekdays}
        />

        <ShiftFilter
          selectedShift={state.shift}
          onShiftChange={(updatedShift) =>
            dispatch({
              type: "SET_SHIFT",
              payload: updatedShift,
            })
          }
        />

        {/* <OrderTypesFilter
          selectedTypes={state.orderTypes}
          onTypesChange={(updatedTypes) =>
            dispatch({
              type: "SET_ORDER_TYPES",
              payload: updatedTypes,
            })
          }
        /> */}

        <TimeWindowFilter
          window={state.timeWindow}
          disabled={disabledFlags.timeWindow}
          onWindowChange={(updatedWindow) =>
            dispatch({
              type: "SET_TIME_WINDOW",
              payload: updatedWindow,
            })
          }
        />

        <ResetFiltersButton show={showReset} onReset={() => dispatch({ type: "RESET" })} />
      </div>

      {/* <Separator className="w-full"/> */}

      <SectionResults results={filteredResults} isLoading={isLoading} />
    </div>
  );
}
