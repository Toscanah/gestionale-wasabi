import { forwardRef, KeyboardEvent, useState } from "react";
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
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils"; // Utility className handler (optional)
import generateTimeSlots from "@/app/(site)/functions/util/generateTimeSlots";

interface WhenSelectorProps {
  className?: string;
  value?: string;
  field?: ControllerRenderProps;
  onValueChange?: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
}

const WhenSelector = forwardRef<HTMLDivElement, WhenSelectorProps>(
  ({ className, field, value, onValueChange, onKeyDown }, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isTimeSelected, setIsTimeSelected] = useState<boolean>(false);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const lunchTimes = generateTimeSlots(12, 0, 14, 30, currentHour, currentMinute);
    const dinnerTimes = generateTimeSlots(18, 30, 22, 30, currentHour, currentMinute);

    const allTimeSlots = [...lunchTimes, ...dinnerTimes];
    const isValuePresent = value && allTimeSlots.includes(value);

    const additionalOptions =
      value && !isValuePresent && value !== "immediate" ? [{ label: value, value }] : [];

    const options = [
      ...additionalOptions,
      { label: "Subito", value: "immediate" },
      ...(lunchTimes.length > 0 ? lunchTimes.map((time) => ({ label: time, value: time })) : []),
      ...(dinnerTimes.length > 0 ? dinnerTimes.map((time) => ({ label: time, value: time })) : []),
    ];

    const renderGroup = (groupOptions: any[], groupLabel?: string) =>
      groupOptions.length > 0 && (
        <CommandGroup >
          {groupLabel && <div className="px-2 py-1 text-sm font-semibold">{groupLabel}</div>}
          {groupOptions.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(currentValue) => {
                if (onValueChange) onValueChange(currentValue);
                if (field) field.onChange(currentValue);
                setOpen(false);
                setIsTimeSelected(true);
              }}
            >
              {option.label}
              <Check
                className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      );

    return (
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            onKeyDown={(e) => {
              if (isTimeSelected && onKeyDown) {
                onKeyDown(e);
                setIsTimeSelected(false);
              }
            }}
            ref={ref as any}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={className}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Seleziona un'orario"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command >
            <CommandInput placeholder="Cerca un orario" className="h-9" />
            <CommandList >
              <CommandEmpty>Nessun orario trovato</CommandEmpty>

              {renderGroup(additionalOptions, "Altre opzioni")}

              {renderGroup([{ label: "Subito", value: "immediate" }], "Subito")}

              {additionalOptions.length > 0 && lunchTimes.length > 0 && <CommandSeparator />}

              {renderGroup(
                lunchTimes.map((time) => ({ label: `${time}`, value: time })),
                "Pranzo"
              )}

              {lunchTimes.length > 0 && dinnerTimes.length > 0 && <CommandSeparator />}

              {renderGroup(
                dinnerTimes.map((time) => ({ label: `${time}`, value: time })),
                "Cena"
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

export default WhenSelector;
