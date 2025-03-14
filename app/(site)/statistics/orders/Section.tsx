import { useEffect, useReducer } from "react";
import { AnyOrder } from "../../models";
import { DateRange } from "../../components/ui/CalendarRange";
import WeekdaysOrDateToggle from "./weekdays-or-date/WeekdaysOrDateToggle";
import WeekdaysSelectionToggle from "./weekdays-or-date/WeekdaysSelectionToggle";
import WeekdaysFilterTypeSelection from "./weekdays-or-date/WeekdaysFilterTypeSelection";

interface SectionProps {
  orders: AnyOrder[];
  id: string;
  removeSection: (id: string) => void;
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

type WeekdaysSelection = { type: "year"; year: "string" } | { type: "range"; range: DateRange };

type Shift = "lunch" | "dinner" | "all";

type Time = { type: "shift"; shift: Shift } | { type: "range"; from: string; to: string };

type SectionState = {
  /** Determines whether selection is based on weekdays or a specific date */
  mainChoice: WeekdaysOrDateChoice;

  /** If `mainChoice === "weekdays"` → these are required, otherwise `undefined` */
  weekdays?: DAYS_OF_WEEK[];
  weekdaysSelection?: WeekdaysSelection;

  /** If `mainChoice === "date"` → this is required, otherwise `undefined` */
  specificDate?: Date;

  /** Defines the selected time range */
  time: Time;
};

const initialState: SectionState = {
  mainChoice: "weekdays",
  time: { type: "shift", shift: "all" },
};

function sectionReducer(state: SectionState, action: any): SectionState {
  switch (action.type) {
    case "SET_MAIN_CHOICE":
      return { ...state, mainChoice: action.payload, weekdays: [], specificDate: undefined };
    case "SET_WEEKDAYS":
      return { ...state, weekdays: action.payload };
    case "SET_WEEKDAYS_SELECTION":
      return { ...state, weekdaysSelection: action.payload };
    case "SET_SPECIFIC_DATE":
      return { ...state, specificDate: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    default:
      return state;
  }
}

type SectionDispatch = React.Dispatch<{ type: string; payload: any }>;

export type SelectionProps<T> = {
  selection: T;
  dispatch: SectionDispatch;
};

export default function Section({ orders }: SectionProps) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);

  const applyFilters = () => {};

  useEffect(() => {
    applyFilters();
  }, []);

  return (
    <div className="flex flex-col space-y-16 w-full h-full p-4 items-center">
      {/* Selection between Weekdays or Specific Date */}
      <WeekdaysOrDateToggle<WeekdaysOrDateChoice>
        selection={state.mainChoice}
        dispatch={dispatch}
      />

      {/* If Weekdays is selected */}
      {state.mainChoice === "weekdays" && (
        <>
          <WeekdaysSelectionToggle<DAYS_OF_WEEK[] | undefined>
            selection={state.weekdays}
            dispatch={dispatch}
          />
          <WeekdaysFilterTypeSelection<WeekdaysSelection | undefined>
            selection={state.weekdaysSelection}
            dispatch={dispatch}
          />
        </>
      )}

      {/* If Specific Date is selected */}
      {/* {state.mainChoice === "date" && (
        <SpecificDatePicker state={state.specificDate} dispatch={dispatch} />
      )} */}

      {/* Time Selection */}
      {/* <TimeSelectionToggle state={state.time} dispatch={dispatch} />
      {state.time.type === "range" && (
        <HoursIntervalFilter state={state.time} dispatch={dispatch} />
      )} */}
    </div>
  );
}
