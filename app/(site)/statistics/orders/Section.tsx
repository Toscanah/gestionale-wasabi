import { AnyOrder } from "../../models";
import WeekdaysOrDateToggle from "./weekdays-or-date/WeekdaysOrDateToggle";
import WeekdaysSelection from "./weekdays-or-date/WeekdaysSelection";
import WeekdaysFilterTypeSelection from "./weekdays-or-date/WeekdaysFilterTypeSelection";
import { DateRange } from "react-day-picker";
import SpecificDatePicker from "./weekdays-or-date/SpecificDatePicker";
import TimeSelectionToggle from "./time-selection/TimeSelectionToggle";
import HoursIntervalFilter from "./time-selection/HoursIntervalFilter";
import ShiftSelection from "./time-selection/ShiftSelection";
import SectionResults from "./SectionResults";
import useOrdersStats from "../../hooks/statistics/useOrdersStats";
import { ReducerActions } from "../../hooks/statistics/sectionReducer";

interface SectionProps {
  orders: AnyOrder[];
  id: string;
}

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

type SectionDispatch = React.Dispatch<{ type: ReducerActions; payload: any }>;

export type SelectionProps<T> = {
  selection: T;
  dispatch: SectionDispatch;
};

export default function Section({ orders }: SectionProps) {
  const { dispatch, filteredResults, isFiltersValid, state } = useOrdersStats(orders);

  const isWeekdaysSelected = state.mainChoice === "weekdays";
  const isSpecificDateSelected = state.mainChoice === "date";
  const hasValidWeekdays = isWeekdaysSelected && !!state.weekdays?.length;
  const hasValidWeekdaysSelection =
    hasValidWeekdays &&
    ((state.weekdaysSelection?.type === "range" && state.weekdaysSelection.range) ||
      (state.weekdaysSelection?.type === "year" && state.weekdaysSelection.year));
  const hasValidSpecificDate = isSpecificDateSelected && state.specificDate;
  const shouldShowTimeSelection = hasValidWeekdaysSelection || hasValidSpecificDate;

  return (
    <div className="flex flex-col gap-8 w-full p-4 items-center max-h-full h-screen">
      <div className="flex flex-col gap-4 items-center">
        <WeekdaysOrDateToggle selection={state.mainChoice} dispatch={dispatch} />
        {isWeekdaysSelected && <WeekdaysSelection selection={state.weekdays} dispatch={dispatch} />}
        {isSpecificDateSelected && (
          <SpecificDatePicker selection={state.specificDate} dispatch={dispatch} />
        )}
      </div>

      {isWeekdaysSelected && hasValidWeekdays && (
        <WeekdaysFilterTypeSelection selection={state.weekdaysSelection} dispatch={dispatch} />
      )}

      <div className="flex flex-col gap-4 items-center">
        {shouldShowTimeSelection && (
          <>
            <TimeSelectionToggle selection={state.time} dispatch={dispatch} />

            {state.time.type === "range" && (
              <HoursIntervalFilter selection={state.time} dispatch={dispatch} />
            )}
            {state.time.type === "shift" && (
              <ShiftSelection selection={state.time.shift} dispatch={dispatch} />
            )}
          </>
        )}
      </div>

      {isFiltersValid() && <SectionResults {...filteredResults} />}
    </div>
  );
}
