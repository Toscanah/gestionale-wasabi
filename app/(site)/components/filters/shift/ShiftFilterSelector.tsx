"use client";

import { Warning } from "@phosphor-icons/react";
import SelectWrapper from "../../ui/select/SelectWrapper";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export enum ShiftFilter {
  BOTH = "both",
  LUNCH = "lunch",
  DINNER = "dinner",
}

interface ShiftFilterSelectorProps {
  shiftFilter: ShiftFilter;
  onShiftChange: (value: ShiftFilter) => void;
  disabled?: boolean;
}

export default function ShiftFilterSelector({
  shiftFilter,
  onShiftChange,
  disabled = false,
}: ShiftFilterSelectorProps) {
  return (
    <div className="flex items-center justify-center w-full gap-4">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild className={cn(shiftFilter === ShiftFilter.BOTH && "hidden")}>
            <Warning size={24} color="red" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-[250px]">
            <p>
              Alcuni ordini potrebbero essere stati registrati in un turno diverso da quello
              effettivo. Il filtro potrebbe quindi mostrare dati non corretti.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SelectWrapper
        className="h-10"
        value={shiftFilter}
        disabled={disabled}
        onValueChange={(value) => onShiftChange(value as ShiftFilter)}
        groups={[
          {
            items: [
              {
                name: "Pranzo + cena",
                value: ShiftFilter.BOTH,
              },
              {
                name: "Pranzo",
                value: ShiftFilter.LUNCH,
              },
              {
                name: "Cena",
                value: ShiftFilter.DINNER,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
