import { ComponentRef, ElementRef, forwardRef, KeyboardEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Clock,
  Moon,
  PuzzlePiece,
  RocketLaunchIcon,
  Sun,
  WineIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import generateTimeSlots from "@/app/(site)/lib/utils/global/time/generateTimeSlots";
import {
  DEFAULT_WHEN_LABEL,
  DEFAULT_WHEN_VALUE,
} from "@/app/(site)/lib/shared/constants/default-when";
import { ShiftBoundaries } from "@/app/(site)/lib/shared";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import WasabiSelect, { CommandGroupType, CommandOption } from "../../wasabi/WasabiSelect";

interface WhenSelectorProps {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
}

// For WhenSelector: prioritizes exact and normalized time matches
const whenSelectorFilter = (value: string, search: string) => {
  if (!search) return 1;

  const normalizedValue = value.replace(/[^0-9]/g, "");
  const normalizedSearch = search.replace(/[^0-9]/g, "");

  if (normalizedValue === normalizedSearch) return 1;

  if (normalizedValue.startsWith(normalizedSearch)) return 0.9;

  if (normalizedSearch.length <= 2 && normalizedValue.startsWith(normalizedSearch)) return 0.8;

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

const WhenSelector = forwardRef<ComponentRef<typeof WasabiSelect>, WhenSelectorProps>(
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
      icon: RocketLaunchIcon,
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
        icon: WineIcon,
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
      <WasabiSelect
        appearance="form"
        groups={groups}
        searchPlaceholder="Cerca un orario..."
        onChange={(val) => {
          // 1. Normalize the input to lowercase and trim spaces
          const cleanVal = val.toLowerCase().trim();

          // 2. Check if the user typed "subito" (or similar) manually
          const finalValue =
            cleanVal === DEFAULT_WHEN_LABEL.toLowerCase() ? DEFAULT_WHEN_VALUE : val;

          // 3. Pass the corrected value
          if (onValueChange) onValueChange(finalValue);
          setOneTimeValue(finalValue);
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
