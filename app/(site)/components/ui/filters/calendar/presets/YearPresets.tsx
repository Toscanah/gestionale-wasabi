import { endOfYear, startOfYear } from "date-fns";
import { RangeModeProps } from "../CalendarFilter";
import { HashStraightIcon } from "@phosphor-icons/react";
import { STARTING_DAY, STARTING_YEAR, YEARS_SINCE_START } from "@/app/(site)/lib/shared";
import WasabiUniversalSelect from "../../../wasabi/WasabiUniversalSelect ";

interface YearPresetsProps {
  handleDateFilter: RangeModeProps["handleDateFilter"];
  triggerClassName?: string;
}

export default function YearPresets({ handleDateFilter, triggerClassName }: YearPresetsProps) {
  const handleYearChange = (year: string) => {
    const y = parseInt(year, 10);

    let from = startOfYear(new Date(y, 0, 1));
    const to = endOfYear(new Date(y, 11, 31));

    if (y === STARTING_YEAR) {
      from = STARTING_DAY;
    }

    handleDateFilter({ from, to });
  };

  const GROUPS = [
    {
      options: [...YEARS_SINCE_START].map((y) => ({
        label: String(y),
        value: String(y),
      })),
    },
  ];

  return (
    <WasabiUniversalSelect
      appearance="filter"
      shouldSort={false}
      triggerIcon={HashStraightIcon}
      mode="transient"
      triggerClassName={triggerClassName}
      title="Anni"
      onChange={handleYearChange}
      groups={GROUPS}
    />
  );
}
