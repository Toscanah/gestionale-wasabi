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
  | { type: "SET_MAIN_CHOICE"; payload: Partial<WeekdaysOrDateChoice> }
  | { type: "SET_WEEKDAYS"; payload: Partial<DAYS_OF_WEEK[]> }
  | { type: "SET_WEEKDAYS_SELECTION"; payload: Partial<WeekdaysSelection> }
  | { type: "SET_SPECIFIC_DATE"; payload: Partial<Date | undefined> }
  | { type: "SET_TIME"; payload: Partial<Time> };

export const initialState: SectionState = {
  mainChoice: "date",
  specificDate: undefined,
  weekdaysSelection: { type: "range", range: undefined },
  time: { type: "range", from: "", to: "" },
};

type UpdateFunction = (state: SectionState, payload: any) => SectionState;
type UpdateFunctions = {
  [key in ReducerActions["type"]]: UpdateFunction;
};

const updateFunctions: UpdateFunctions = {
  SET_MAIN_CHOICE: (state, payload) => ({
    ...state,
    mainChoice: payload,
  }),

  SET_WEEKDAYS: (state, payload) => ({
    ...state,
    weekdays: payload,
  }),

  SET_WEEKDAYS_SELECTION: (state, payload) => ({
    ...state,
    weekdaysSelection: {
      ...state.weekdaysSelection,
      ...payload,
    },
  }),

  SET_SPECIFIC_DATE: (state, payload) => ({
    ...state,
    specificDate: payload,
  }),

  SET_TIME: (state, payload) => ({
    ...state,
    time: {
      ...state.time,
      ...payload,
    },
  }),
};

const sectionReducer = (state: SectionState, action: ReducerActions) =>
  updateFunctions[action.type]?.(state, action.payload) ?? state;

export default sectionReducer;
