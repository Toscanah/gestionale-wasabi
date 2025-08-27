import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import { SelectionProps } from "../Section";

export default function SpecificDatePicker({
  selection: specificDate,
  dispatch,
}: SelectionProps<Date | undefined>) {
  return (
    <CalendarFilter
      mode="single"
      dateFilter={specificDate}
      handleDateFilter={(newDate) =>
        dispatch({ type: "SET_SPECIFIC_DATE", payload: newDate as Date })
      }
    />
  );
}
