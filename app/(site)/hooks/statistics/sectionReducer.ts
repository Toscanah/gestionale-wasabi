import { DAYS_OF_WEEK, Time, WeekdaysOrDateChoice, WeekdaysSelection } from "./useOrdersStats";

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

export type ReducerActions =
  | "SET_MAIN_CHOICE"
  | "SET_WEEKDAYS"
  | "SET_WEEKDAYS_SELECTION"
  | "SET_SPECIFIC_DATE"
  | "SET_TIME";

export const initialState: SectionState = {
  mainChoice: "weekdays",
  weekdaysSelection: { type: "range", range: undefined },
  time: { type: "shift", shift: "all" },
};

export function sectionReducer(
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
