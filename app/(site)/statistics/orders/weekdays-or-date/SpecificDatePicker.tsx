import Calendar from "@/app/(site)/components/calendar/Calendar";
import { SelectionProps } from "../Section";

export default function SpecificDatePicker({
  selection: specificDate,
  dispatch,
}: SelectionProps<Date | undefined>) {
  return (
    <Calendar
      date={specificDate}
      handleDateSelect={(newDate) => dispatch({ type: "SET_SPECIFIC_DATE", payload: newDate })}
    />
  );
}
