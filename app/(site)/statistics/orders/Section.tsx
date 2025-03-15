import { useEffect, useReducer, useState } from "react";
import { AnyOrder } from "../../models";
import WeekdaysOrDateToggle from "./weekdays-or-date/WeekdaysOrDateToggle";
import WeekdaysSelectionToggle from "./weekdays-or-date/WeekdaysSelectionToggle";
import WeekdaysFilterTypeSelection from "./weekdays-or-date/WeekdaysFilterTypeSelection";
import { DateRange } from "react-day-picker";
import SpecificDatePicker from "./weekdays-or-date/SpecificDatePicker";
import TimeSelectionToggle from "./time-selection/TimeSelectionToggle";
import HoursIntervalFilter from "./time-selection/HoursIntervalFilter";
import ShiftSelection from "./time-selection/ShiftSelection";
import { OrderType } from "@prisma/client";
import SectionResults from "./SectionResults";

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

export type WeekdaysSelection =
  | { type: "year"; year: string }
  | { type: "range"; range: DateRange | undefined };

export type Shift = "lunch" | "dinner" | "all";

export type Time = { type: "shift"; shift: Shift } | { type: "range"; from: string; to: string };

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
  weekdaysSelection: { type: "range", range: undefined },
  time: { type: "shift", shift: "all" },
  // time: {type: "range", from: ""}
};

type ReducerActions =
  | "SET_MAIN_CHOICE"
  | "SET_WEEKDAYS"
  | "SET_WEEKDAYS_SELECTION"
  | "SET_SPECIFIC_DATE"
  | "SET_TIME";

function sectionReducer(
  state: SectionState,
  action: { type: ReducerActions; payload: any }
): SectionState {
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

type SectionDispatch = React.Dispatch<{ type: ReducerActions; payload: any }>;

export type SelectionProps<T> = {
  selection: T;
  dispatch: SectionDispatch;
};

export default function Section({ orders }: SectionProps) {
  const [state, dispatch] = useReducer(sectionReducer, initialState);
  const [filteredResults, setFilteredResults] = useState({
    homeOrders: 0,
    pickupOrders: 0,
    tableOrders: 0,
    totalRiceConsumed: 0,
  });

  const applyFilters = () => {
    let filteredOrders: AnyOrder[] = [...orders]; // Clone the orders array

    // Convert weekdays to numbers (Monday = 0)
    const weekdayMap = {
      [DAYS_OF_WEEK.TUESDAY]: 2,
      [DAYS_OF_WEEK.WEDNESDAY]: 3,
      [DAYS_OF_WEEK.THURSDAY]: 4,
      [DAYS_OF_WEEK.FRIDAY]: 5,
      [DAYS_OF_WEEK.SATURDAY]: 6,
      [DAYS_OF_WEEK.SUNDAY]: 0,
    };

    if (!state.mainChoice) return;

    // Step 1: Apply Date Filters
    if (state.mainChoice === "weekdays") {
      if (!state.weekdays?.length) return;

      const selectedWeekdays = state.weekdays.map((day) => weekdayMap[day]) || [];
      filteredOrders = filteredOrders.filter((order) =>
        selectedWeekdays.includes(new Date(order.created_at).getDay())
      );

      if (state.weekdaysSelection?.type === "range") {
        if (!state.weekdaysSelection.range?.from || !state.weekdaysSelection.range?.to) return;

        const start = new Date(state.weekdaysSelection.range.from);
        const end = new Date(state.weekdaysSelection.range.to);
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= start && orderDate <= end;
        });
      } else if (state.weekdaysSelection?.type === "year") {
        if (!state.weekdaysSelection.year) return;

        const selectedYear = Number(state.weekdaysSelection.year);
        filteredOrders = filteredOrders.filter((order) => {
          const orderYear = new Date(order.created_at).getFullYear();
          return orderYear === selectedYear;
        });
      }
    } else if (state.mainChoice === "date") {
      if (!state.specificDate) return;

      const specificDate = new Date(state.specificDate);
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return (
          orderDate.getFullYear() === specificDate.getFullYear() &&
          orderDate.getMonth() === specificDate.getMonth() &&
          orderDate.getDate() === specificDate.getDate()
        );
      });
    }

    if (!state.time) return;

    // Step 2: Apply Time Filters
    if (state.time.type === "shift") {
      const lunchStart = 10.5,
        lunchEnd = 14.5;
      const dinnerStart = 17.5,
        dinnerEnd = 22.5;

      filteredOrders = filteredOrders.filter((order) => {
        const orderHour = new Date(order.created_at).getHours();

        if (state.time.type === "shift") {
          if (state.time.shift === "lunch") {
            return orderHour >= lunchStart && orderHour < lunchEnd;
          } else if (state.time.shift === "dinner") {
            return orderHour >= dinnerStart && orderHour < dinnerEnd;
          } else if (state.time.shift === "all") {
            // ✅ Include both lunch and dinner
            return (
              (orderHour >= lunchStart && orderHour < lunchEnd) ||
              (orderHour >= dinnerStart && orderHour < dinnerEnd)
            );
          }
        }

        return true; // Fallback in case no filtering applies
      });
    } else if (state.time.type === "range") {
      if (!state.time.from || !state.time.to) return;

      const timeStart = new Date(`1970-01-01T${state.time.from}`).getHours();
      const timeEnd = new Date(`1970-01-01T${state.time.to}`).getHours();

      filteredOrders = filteredOrders.filter((order) => {
        const orderHour = new Date(order.created_at).getHours();
        return orderHour >= timeStart && orderHour <= timeEnd;
      });
    }

    // Step 3: Calculate Results
    const homeOrders = filteredOrders.filter((order) => order.type === OrderType.HOME).length;
    const pickupOrders = filteredOrders.filter((order) => order.type === OrderType.PICKUP).length;
    const tableOrders = filteredOrders.filter((order) => order.type === OrderType.TABLE).length;
    const totalRiceConsumed = filteredOrders.reduce((sum, order) => {
      // Sum rice_quantity for all products in the order
      const riceInOrder = order.products.reduce(
        (prodSum, product) => prodSum + (product.rice_quantity || 0),
        0
      );
      return sum + riceInOrder;
    }, 0);

    setFilteredResults({ homeOrders, pickupOrders, tableOrders, totalRiceConsumed });
  };

  useEffect(() => {
    applyFilters();
  }, [state.mainChoice, state.weekdays, state.weekdaysSelection, state.specificDate, state.time]);

  // ✅ Helper variables to improve readability
  const isWeekdaysSelected = state.mainChoice === "weekdays";
  const isSpecificDateSelected = state.mainChoice === "date";

  // Weekdays should be valid if they are selected and contain at least one value
  const hasValidWeekdays = isWeekdaysSelected && !!state.weekdays?.length;

  // Weekdays selection is valid if it's a range with a value or a year with a value
  const hasValidWeekdaysSelection =
    hasValidWeekdays &&
    ((state.weekdaysSelection?.type === "range" && state.weekdaysSelection.range) ||
      (state.weekdaysSelection?.type === "year" && state.weekdaysSelection.year));

  // Specific date is valid if it's selected and has a value
  const hasValidSpecificDate = isSpecificDateSelected && state.specificDate;

  // Time selection should be shown if either valid weekdays or a valid specific date exists
  const shouldShowTimeSelection = hasValidWeekdaysSelection || hasValidSpecificDate;

  return (
    <div className="flex flex-col space-y-16 w-full h-full p-4 items-center">
      {/* Selection between Weekdays or Specific Date */}
      <WeekdaysOrDateToggle selection={state.mainChoice} dispatch={dispatch} />

      {/* If Weekdays is selected */}
      {isWeekdaysSelected && (
        <>
          <WeekdaysSelectionToggle selection={state.weekdays} dispatch={dispatch} />
          {hasValidWeekdays && (
            <WeekdaysFilterTypeSelection selection={state.weekdaysSelection} dispatch={dispatch} />
          )}
        </>
      )}

      {/* If Specific Date is selected */}
      {isSpecificDateSelected && (
        <SpecificDatePicker selection={state.specificDate} dispatch={dispatch} />
      )}

      {/* Time Selection (Only show if Weekdays or Specific Date is properly selected) */}
      {shouldShowTimeSelection && (
        <>
          <TimeSelectionToggle selection={state.time} dispatch={dispatch} />

          {/* Render the correct time selection input based on `shift` or `range` */}
          {state.time.type === "range" && (
            <HoursIntervalFilter selection={state.time} dispatch={dispatch} />
          )}
          {state.time.type === "shift" && (
            <ShiftSelection selection={state.time.shift} dispatch={dispatch} />
          )}
        </>
      )}

      <SectionResults {...filteredResults} />
    </div>
  );
}
