import { CalendarIcon } from "@phosphor-icons/react";
import WasabiSelect from "../../../wasabi/WasabiSelect";
import { RangeModeProps } from "../CalendarFilter";
import {
  ITALIAN_MONTHS,
  STARTING_DAY,
  STARTING_YEAR,
} from "@/app/(site)/lib/shared/constants/_index";
import { endOfMonth, startOfMonth } from "date-fns";

interface MonthPresetsProps {
  handleDateFilter: RangeModeProps["handleDateFilter"];
  triggerClassName?: string;
  setVisibleMonth: (date: Date) => void;
}

export default function MonthPresets({
  handleDateFilter,
  triggerClassName,
  setVisibleMonth,
}: MonthPresetsProps) {
  const handleMonthChange = (val: string) => {
    const monthIndex = ITALIAN_MONTHS.indexOf(val);
    const year = new Date().getFullYear();

    let from = startOfMonth(new Date(year, monthIndex));
    const to = endOfMonth(new Date(year, monthIndex));

    if (year === STARTING_YEAR && monthIndex === 0) {
      from = STARTING_DAY;
    }

    handleDateFilter({ from, to });
    setVisibleMonth(from);
  };

  const GROUPS = [
    {
      options: [...ITALIAN_MONTHS].map((m) => ({
        label: String(m),
        value: String(m),
      })),
    },
  ];

  return (
    <WasabiSelect
      searchPlaceholder="Cerca mese"
      triggerIcon={CalendarIcon}
      shouldSort={false}
      appearance="filter"
      title="Mesi"
      mode="transient"
      triggerClassName={triggerClassName}
      onChange={handleMonthChange}
      groups={GROUPS}
    />
  );
}
