import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { forwardRef, KeyboardEvent, RefObject } from "react";
import { ControllerRenderProps } from "react-hook-form";
import generateTimeSlots from "../util/functions/generateTimeSlots";

const WhenSelector = forwardRef<
  HTMLButtonElement,
  {
    handleKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>) => void;
    className?: string;
    isForm?: boolean;
    field?: ControllerRenderProps;
  }
>(({ handleKeyDown, className, isForm, field }, ref) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const lunchTimes =
    currentHour >= 11 && currentHour < 16
      ? generateTimeSlots(12, 0, 14, 30, currentHour, currentMinute)
      : [];
  const dinnerTimes =
    currentHour >= 17 && currentHour <= 22
      ? generateTimeSlots(18, 30, 22, 30, currentHour, currentMinute)
      : [];

  return (
    <Select
      onValueChange={isForm && field ? field.onChange : undefined}
      defaultValue={isForm && field ? field.value : "immediate"}
    >
      <SelectTrigger
        className={cn(className ? className : "w-full text-3xl h-16")}
        ref={ref}
        onKeyDown={(e) => {
          if (handleKeyDown) {
            handleKeyDown(e);
          }
        }}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="immediate" className="text-xl" defaultChecked>
            Subito
          </SelectItem>
        </SelectGroup>

        {lunchTimes.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-xl space-y-2">
              <Separator orientation="horizontal" />
              <div>Pranzo</div>
            </SelectLabel>
            {lunchTimes.map((time) => (
              <SelectItem key={time} value={time} className="text-xl">
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        {dinnerTimes.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-xl space-y-2">
              <Separator orientation="horizontal" />
              <div>Cena</div>
            </SelectLabel>
            {dinnerTimes.map((time) => (
              <SelectItem key={time} value={time} className="text-xl">
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
});

export default WhenSelector;
