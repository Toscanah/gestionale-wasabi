import { Weekday, WEEKDAY_LABELS } from "@/app/(site)/lib/shared";
import { Calendar, CalendarDotsIcon } from "@phosphor-icons/react";
import WasabiSelect from "../../wasabi/WasabiSelect";

export const ALL_WEEKDAYS: Weekday[] = [2, 3, 4, 5, 6, 0];

export interface WeekdaysFilterProps {
  weekdays: Weekday[];
  onWeekdaysChange: (weekdays: Weekday[]) => void;
  disabled?: boolean;
}

export default function WeekdaysFilter({
  weekdays,
  onWeekdaysChange,
  disabled = false,
}: WeekdaysFilterProps) {
  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0) {
      onWeekdaysChange(ALL_WEEKDAYS);
    } else {
      onWeekdaysChange(newValues.map((v) => Number(v) as Weekday));
    }
  };

  return (
    <WasabiSelect
      appearance="filter"
      searchPlaceholder="Cerca giorni..."
      disabled={disabled}
      mode="multi"
      allLabel="Tutti"
      title="Giorni settimana"
      selectedValues={weekdays.map(String)}
      onChange={handleChange}
      triggerIcon={CalendarDotsIcon}
      shouldClear={weekdays.length !== ALL_WEEKDAYS.length}
      groups={[
        {
          options: ALL_WEEKDAYS.map((val) => ({
            label: WEEKDAY_LABELS[val],
            value: String(val),
          })),
        },
      ]}
    />
  );
}
