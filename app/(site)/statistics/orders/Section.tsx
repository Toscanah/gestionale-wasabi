import { useEffect, useState } from "react";
import { AnyOrder } from "../../models";
import { DAYS_OF_WEEK } from "./page";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup } from "@/components/ui/radio-group";
import RangeFilter from "./filters/RangeFilter";
import YearFilter from "./filters/YearFilter";
import { DateRange } from "../../components/ui/CalendarRange";
import HoursIntervalFilter from "./filters/HoursIntervalFilter";

interface SectionProps {
  orders: AnyOrder[];
  id: string;
  removeSection: (id: string) => void;
}

type TimePriod = "year" | "range";

export type Year = `${19 | 20}${number}${number}`;

export type HoursInterval = { from: string | undefined; to: string | undefined };

const getFirstOrderYear = (orders: AnyOrder[]): number | null => {
  if (orders.length === 0) return null;

  const firstOrder = orders.reduce((earliest, order) =>
    new Date(order.created_at) < new Date(earliest.created_at) ? order : earliest
  );

  return new Date(firstOrder.created_at).getFullYear();
};

export default function Section({ orders }: SectionProps) {
  const [daysOfWeek, setDaysOfWeek] = useState<DAYS_OF_WEEK[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePriod>("range");

  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);
  const [yearFilter, setYearFilter] = useState<Year | undefined>(undefined);
  const [hoursInterval, setHoursInterval] = useState<HoursInterval | undefined>(undefined);

  const handleValueChange = (newDays: string[]) => setDaysOfWeek(newDays as DAYS_OF_WEEK[]);

  const applyFilters = () => {
    
  };

  useEffect(() => {
    applyFilters();
  }, [daysOfWeek, timePeriod, dateFilter, yearFilter, hoursInterval]);

  return (
    <div className="flex flex-col space-y-8 w-full h-full p-4 items-center">
      <ToggleGroup
        type="multiple"
        variant="outline"
        className="w-1/2 flex gap-4"
        value={daysOfWeek}
        onValueChange={handleValueChange}
      >
        {Object.values(DAYS_OF_WEEK).map((day) => (
          <ToggleGroupItem value={day} key={day} className="flex-1">
            {day}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <RadioGroup
        value={timePeriod}
        onValueChange={(newPeriod) => setTimePeriod(newPeriod as TimePriod)}
        className="w-1/2 flex gap-4 items-center"
      >
        <RangeFilter
          disabled={timePeriod == "year"}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <YearFilter
          firstEverYear={getFirstOrderYear(orders) || 2024}
          setYearFilter={setYearFilter}
          yearFilter={yearFilter}
          disabled={timePeriod == "range"}
        />
      </RadioGroup>

      <HoursIntervalFilter setHoursInterval={setHoursInterval} hoursInterval={hoursInterval} />
    </div>
  );
}
