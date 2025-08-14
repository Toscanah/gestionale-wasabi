import { TextSize } from "react-thermal-printer";

type PrintSize = { width: TextSize; height: TextSize };

export const SMALL_PRINT: PrintSize = { width: 1, height: 1 };
export const BIG_PRINT: PrintSize = { width: 2, height: 2 };

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};
