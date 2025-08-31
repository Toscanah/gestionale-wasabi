import { startOfDay, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { DatePreset } from "../../../shared/enums/date-preset";
import { DateRange } from "react-day-picker";

export default function getDateRangeFromPreset(
  value: DatePreset,
  today: Date = new Date()
): DateRange | undefined {
  switch (value) {
    case DatePreset.TODAY:
      return { from: startOfDay(today), to: startOfDay(today) };
    case DatePreset.YESTERDAY:
      const yesterday = subDays(today, 1);
      return { from: startOfDay(yesterday), to: startOfDay(yesterday) };
    case DatePreset.LAST_7:
      const last7 = subDays(today, 6);
      return { from: startOfDay(last7), to: startOfDay(today) };
    case DatePreset.LAST_30:
      const last30 = subDays(today, 29);
      return { from: startOfDay(last30), to: startOfDay(today) };
    case DatePreset.LAST_MONTH:
      const lastMonth = subDays(today, 30);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    case DatePreset.THIS_MONTH:
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case DatePreset.THIS_YEAR:
      return { from: startOfYear(today), to: endOfYear(today) };
    default:
      return undefined;
  }
}
