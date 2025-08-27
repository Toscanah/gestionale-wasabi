import WasabiSingleSelect from "@/app/(site)/components/ui/select/WasabiSingleSelect";
import { WeekFilterEnum } from "@/app/(site)/hooks/engagement/useEngagementFilters";

interface WeekFilterProps {
  weekFilter: WeekFilterEnum;
  onWeekFilterChange: (newFilter: WeekFilterEnum) => void;
}

export default function WeekFilter({ weekFilter, onWeekFilterChange }: WeekFilterProps) {
  return (
    <WasabiSingleSelect
      itemClassName="text-sm"
      className="h-10"
      value={weekFilter}
      onValueChange={(newFilter) => onWeekFilterChange(newFilter as WeekFilterEnum)}
      groups={[
        {
          items: [
            { name: "Questa settimana", value: WeekFilterEnum.THIS_WEEK },
            { name: "Ultima settimana", value: WeekFilterEnum.LAST_WEEK },
            { name: "Due settimane fa", value: WeekFilterEnum.TWO_WEEKS_AGO },
            { name: "Tre settimane fa", value: WeekFilterEnum.THREE_WEEKS_AGO },
            { name: "Quattro settimane fa", value: WeekFilterEnum.FOUR_WEEKS_AGO },
          ],
        },
      ]}
    />
  );
}
