import { Dispatch, SetStateAction } from "react";
import { Year } from "../Section";
import SelectWrapper from "@/app/(site)/components/select/SelectWrapper";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface YearFilterProps {
  disabled?: boolean;
  yearFilter: Year | undefined;
  setYearFilter: Dispatch<SetStateAction<Year | undefined>>;
  firstEverYear: number;
}

export default function YearFilter({
  disabled = false,
  firstEverYear,
  yearFilter,
  setYearFilter,
}: YearFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - firstEverYear + 1 }, (_, i) =>
    (firstEverYear + i).toString()
  );

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="year" id="year-filter"></RadioGroupItem>
        <Label htmlFor="year-filter">Anno</Label>
      </div>
      <SelectWrapper
        value={yearFilter}
        onValueChange={(newYear) => setYearFilter(newYear as Year)}
        placeholder="Seleziona un'anno"
        className="h-10"
        groups={[{ items: years }]}
        disabled={disabled}
      />
    </div>
  );
}
