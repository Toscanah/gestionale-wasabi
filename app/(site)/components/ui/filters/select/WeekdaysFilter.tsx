import WasabiSelect from "./WasabiSelect";
import { Calendar } from "@phosphor-icons/react";

export type Weekday = 0 | 2 | 3 | 4 | 5 | 6;

export const ALL_WEEKDAYS: Weekday[] = [0, 2, 3, 4, 5, 6];

// labels for weekdays (0 = Sunday, 6 = Saturday)
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
  0: "Domenica",
};

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
      disabled={disabled}
      mode="multi"
      allLabel="Tutti"
      title="Giorni settimana"
      selectedValues={weekdays.map(String)}
      onChange={handleChange}
      triggerIcon={Calendar}
      shouldClear={weekdays.length !== ALL_WEEKDAYS.length}
      groups={[
        {
          options: Object.entries(WEEKDAY_LABELS).map(([val, label]) => ({
            label,
            value: val,
          })),
        },
      ]}
    />
  );
}
