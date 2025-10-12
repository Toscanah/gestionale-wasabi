import { startOfDay } from "date-fns";

export const STARTING_YEAR = 2025;
export const YEARS_SINCE_START = Array.from(
  { length: new Date().getFullYear() - STARTING_YEAR + 1 },
  (_, i) => STARTING_YEAR + i
).sort((a, b) => a - b);

export const STARTING_DAY = startOfDay(new Date(STARTING_YEAR, 0, 5));