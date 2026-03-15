import {
  startOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  endOfDay,
  subMonths,
} from "date-fns";
import { DatePreset } from "@/lib/shared/enums/date-presets";
import { DateRange } from "react-day-picker";
import { APP_STARTING_DAY, APP_STARTING_YEAR } from "@/lib/shared/constants";

export default function getDateRangeFromPreset(
  value: DatePreset,
  today: Date = new Date()
): DateRange | undefined {
  switch (value) {
    case DatePreset.TODAY:
      return { from: startOfDay(today), to: endOfDay(today) };
    case DatePreset.YESTERDAY:
      const yesterday = subDays(today, 1);
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    case DatePreset.LAST_7:
      const last7 = subDays(today, 6);
      return { from: startOfDay(last7), to: endOfDay(today) };
    case DatePreset.LAST_30:
      const last30 = subDays(today, 29);
      return { from: startOfDay(last30), to: endOfDay(today) };
    case DatePreset.LAST_MONTH:
      const lastMonth = subMonths(today, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    case DatePreset.THIS_MONTH:
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case DatePreset.THIS_YEAR:
      if (today.getFullYear() === APP_STARTING_YEAR) {
        return { from: APP_STARTING_DAY, to: endOfYear(today) };
      }
      return { from: startOfYear(today), to: endOfYear(today) };
    case DatePreset.TO_TODAY:
      return { from: APP_STARTING_DAY, to: endOfDay(today) };
    case DatePreset.TO_YESTERDAY:
      const toYesterday = subDays(today, 1);
      return { from: APP_STARTING_DAY, to: endOfDay(toYesterday) };
    default:
      return undefined;
  }
}
