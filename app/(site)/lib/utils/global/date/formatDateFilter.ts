import { format } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export default function formatDateFilter(
  mode: "single" | "range",
  dateFilter: Date | DateRange | undefined,
  locale = it
): string {
  if (mode === "single") {
    return format((dateFilter as Date) ?? new Date(), "PPP", { locale });
  }

  const range = dateFilter as DateRange | undefined;
  if (range?.from) {
    return range.to
      ? `${format(range.from, "PPP", { locale })} - ${format(range.to, "PPP", {
          locale,
        })}`
      : format(range.from, "PPP", { locale });
  }

  return "Da sempre";
}
