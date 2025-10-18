import { DateRange } from "react-day-picker";
import { ShiftFilterValue } from "../../lib/shared/enums/Shift";
import { OrderType } from "@prisma/client";
import { FULL_DAY_RANGE, TimeWindow } from "../../components/ui/filters/time/TimeWindowFilter";
import TODAY_PERIOD from "../../lib/shared/constants/today-period";
import { Weekday } from "../../lib/shared";
import { ALL_WEEKDAYS } from "../../components/ui/filters/select/WeekdaysFilter";

export interface OrderFilters {
  // date selection
  period: DateRange; // always a range (single = same from/to)

  // optional refinements
  weekdays: Weekday[]; // limit to specific days of week
  shift: ShiftFilterValue;
  timeWindow: TimeWindow; // "HH:mm"

  orderTypes: OrderType[];
}

// the reducer state is simply the filters
export type SectionState = OrderFilters;

// action types
export type ReducerActions =
  | { type: "SET_PERIOD"; payload: DateRange }
  | { type: "SET_WEEKDAYS"; payload: Weekday[] }
  | { type: "SET_SHIFT"; payload: ShiftFilterValue }
  | { type: "SET_TIME_WINDOW"; payload: TimeWindow }
  | { type: "SET_ORDER_TYPES"; payload: OrderType[] }
  | { type: "RESET" };

// sensible defaults
export const INITIAL_STATE: SectionState = {
  period: TODAY_PERIOD,
  shift: ShiftFilterValue.ALL,
  weekdays: ALL_WEEKDAYS, // no weekday restriction
  timeWindow: FULL_DAY_RANGE, // no custom time
  orderTypes: [...Object.values(OrderType)],
};

// reducer implementation
const sectionReducer = (state: SectionState, action: ReducerActions): SectionState => {
  switch (action.type) {
    case "SET_PERIOD":
      return { ...state, period: action.payload };
    case "SET_WEEKDAYS":
      return { ...state, weekdays: action.payload };
    case "SET_SHIFT":
      return { ...state, shift: action.payload };
    case "SET_TIME_WINDOW":
      return { ...state, timeWindow: action.payload };
    case "SET_ORDER_TYPES":
      return { ...state, orderTypes: action.payload };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default sectionReducer;
