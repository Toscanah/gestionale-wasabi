import CalendarRange, {
  CalendarRangePreset,
  DateRange,
} from "@/app/(site)/components/ui/CalendarRange";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { endOfMonth, startOfDay, startOfMonth, subDays } from "date-fns";

interface RangeFilterProps {
  disabled?: boolean;
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
}

const PRESETS: CalendarRangePreset[] = [
  {
    name: "Oggi",
    value: "today",
  },
  {
    name: "Ieri",
    value: "yesterday",
  },
  {
    name: "Ultimi 7 giorni",
    value: "last7",
  },
  {
    name: "Ultimi 30 giorni",
    value: "last30",
  },
  {
    name: "Questo mese",
    value: "thisMonth",
  },
];

export default function RangeFilter({
  disabled = false,
  dateFilter,
  setDateFilter,
}: RangeFilterProps) {
  const handlePresetSelection = (value: string) => {
    const today = startOfDay(new Date());

    const presetRanges: Record<string, { from: Date; to: Date }> = {
      today: { from: today, to: today },
      yesterday: { from: subDays(today, 1), to: subDays(today, 1) },
      last7: { from: subDays(today, 6), to: today },
      last30: { from: subDays(today, 29), to: today },
      thisMonth: { from: startOfMonth(today), to: endOfMonth(today) },
    };

    const selectedPreset = presetRanges[value];

    if (selectedPreset) {
      setDateFilter(selectedPreset);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="range" id="date-filter" />
        <Label htmlFor="date-filter">Intervallo</Label>
      </div>

      <CalendarRange
        disabled={disabled}
        handlePresetSelection={handlePresetSelection}
        presets={PRESETS}
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
      />
    </div>
  );
}
