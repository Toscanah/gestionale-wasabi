import { ElementRef, forwardRef, KeyboardEvent, useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Check, Clock, Moon, PuzzlePiece, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import generateTimeSlots from "@/app/(site)/lib/utils/global/time/generateTimeSlots";
import WasabiSelect, { CommandGroupType, CommandOption } from "../../wasabi/WasabiSelect";
import {
  DEFAULT_WHEN_LABEL,
  DEFAULT_WHEN_VALUE,
} from "@/app/(site)/lib/shared/constants/default-when";
import { ShiftBoundaries } from "@/app/(site)/lib/shared";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import WasabiUniversalSelect from "../../wasabi/WasabiUniversalSelect ";

interface WhenSelectorProps {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
}

// For WhenSelector: prioritizes exact and normalized time matches
const whenSelectorFilter = (value: string, search: string) => {
  if (!search) return 1;

  const normalizedValue = value.replace(/[^0-9]/g, ""); // "21:00" → "2100"
  const normalizedSearch = search.replace(/[^0-9]/g, ""); // "21" → "21"

  // Exact normalized match (e.g. "2100" === "2100")
  if (normalizedValue === normalizedSearch) return 1;

  // If user types "20" or "200" → match values that start with "20"
  if (normalizedValue.startsWith(normalizedSearch)) return 0.9;

  // Allow 2-digit hour partial match (e.g. "20" matches "2000" but "200" shouldn't match "1200")
  if (normalizedSearch.length <= 2 && normalizedValue.startsWith(normalizedSearch)) return 0.8;

  // Otherwise, ignore matches that are inside another number
  return 0;
};

function floatToHourMinute(value: number, minuteOffset = 0): [number, number] {
  const hour = Math.floor(value);
  let minute = Math.round((value - hour) * 60) + minuteOffset;

  let adjustedHour = hour;
  if (minute >= 60) {
    adjustedHour += Math.floor(minute / 60);
    minute = minute % 60;
  }

  return [adjustedHour, minute];
}

const WhenSelector = forwardRef<ElementRef<typeof WasabiSelect>, WhenSelectorProps>(
  ({ className, value, onValueChange, onKeyDown }, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const [oneTimeValue, setOneTimeValue] = useState<string>("");

    const { settings } = useWasabiContext();
    const GAP = settings.whenSelectorGap || 1;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // const currentHour = 11;
    // const currentMinute = 30;

    const [lunchFromHour, lunchFromMinute] = floatToHourMinute(ShiftBoundaries.LUNCH_FROM);
    const [lunchToHour, lunchToMinute] = floatToHourMinute(ShiftBoundaries.LUNCH_TO);

    const [dinnerFromHour, dinnerFromMinute] = floatToHourMinute(ShiftBoundaries.DINNER_FROM, GAP);
    const [dinnerToHour, dinnerToMinute] = floatToHourMinute(ShiftBoundaries.DINNER_TO);

    const lunchTimes = generateTimeSlots(
      lunchFromHour,
      lunchFromMinute,
      lunchToHour,
      lunchToMinute,
      currentHour,
      currentMinute,
      GAP
    );

    const dinnerTimes = generateTimeSlots(
      dinnerFromHour,
      dinnerFromMinute,
      dinnerToHour,
      dinnerToMinute,
      currentHour,
      currentMinute,
      GAP
    );

    const allTimeSlots = [...lunchTimes, ...dinnerTimes];
    const isValuePresent = value && allTimeSlots.includes(value);

    const additionalOption: CommandOption | null =
      value && !isValuePresent && value !== DEFAULT_WHEN_VALUE ? { label: value, value } : null;

    const groups: CommandGroupType[] = [];

    if (additionalOption) {
      groups.push({
        label: "Altre opzioni",
        icon: PuzzlePiece,
        options: [additionalOption],
      });
    }

    groups.push({
      label: DEFAULT_WHEN_LABEL,
      icon: Clock,
      options: [{ label: DEFAULT_WHEN_LABEL, value: DEFAULT_WHEN_VALUE }],
    });

    if (lunchTimes.length > 0) {
      groups.push({
        label: "Pranzo",
        icon: Sun,
        options: lunchTimes.map((time) => ({ label: time, value: time })),
      });
    }

    if (dinnerTimes.length > 0) {
      groups.push({
        label: "Cena",
        icon: Moon,
        options: dinnerTimes.map((time) => ({ label: time, value: time })),
      });
    }

    const handleOpenChange = (open: boolean) => {
      setOpen(open);
    };

    const handleOneKeyDown = (e: KeyboardEvent<any>) => {
      if (!oneTimeValue) {
        return;
      }

      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        onKeyDown?.(e);
      }
    };

    return (
      <WasabiUniversalSelect
        appearance="form"
        groups={groups}
        searchPlaceholder="Cerca un orario..."
        onChange={(value) => {
          if (onValueChange) onValueChange(value);
          setOneTimeValue(value);
          setOpen(false);
        }}
        filterFn={whenSelectorFilter}
        mode="single"
        trigger={(selected) => (
          <Button
            onKeyDown={handleOneKeyDown}
            variant="outline"
            className={cn("h-12 w-full text-xl uppercase", className)}
          >
            {selected ? selected.label : ""}
          </Button>
        )}
        selectedValue={value || ""}
        ref={ref}
        open={open}
        onOpenChange={handleOpenChange}
      />
    );
  }
);

WhenSelector.displayName = "WhenSelector";

export default WhenSelector;
