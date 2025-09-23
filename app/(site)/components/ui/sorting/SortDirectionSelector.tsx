import { SortDirection } from "@/app/(site)/lib/shared/schemas/common/sorting";
import WasabiSingleSelect from "../wasabi/WasabiSingleSelect";

interface SortDirectionSelectorProps {
  direction: SortDirection;
  onDirectionChange: (updatedDirection: SortDirection) => void;
}

export default function SortDirectionSelector({
  direction,
  onDirectionChange,
}: SortDirectionSelectorProps) {
  return (
    <WasabiSingleSelect
      value={direction}
      onValueChange={(value) => onDirectionChange(value as SortDirection)}
      groups={[
        {
          items: [
            { label: "Più grandi prima, poi più piccoli", value: "desc" },
            { label: "Più piccoli prima, poi più grandi", value: "asc" },
          ],
        },
      ]}
    />
  );
}
