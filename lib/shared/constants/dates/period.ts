import { endOfDay, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export const APP_STARTING_YEAR = 2025;
export const APP_STARTING_DAY = startOfDay(new Date(APP_STARTING_YEAR, 0, 5));

export const YEARS_SINCE_START = Array.from(
  { length: new Date().getFullYear() - APP_STARTING_YEAR + 1 },
  (_, i) => APP_STARTING_YEAR + i,
).sort((a, b) => a - b);

export const TODAY_PERIOD: DateRange = {
  from: startOfDay(new Date()),
  to: endOfDay(new Date()),
};
