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
import generateTimeSlots from "../util/generateTimeSlots";

const WhenSelector = forwardRef<
  HTMLButtonElement,
  {
    nextRef?: RefObject<HTMLInputElement | HTMLButtonElement> | null;
    handleKeyDown?: (
      e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
      nextRef: RefObject<HTMLInputElement | HTMLButtonElement> | null
    ) => void;
    className?: string;
    isForm?: boolean;
    field?: ControllerRenderProps;
  }
>(({ nextRef, handleKeyDown, className, isForm, field }, ref) => {
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
            handleKeyDown(e, nextRef ?? null);
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

        <SelectGroup>
          <SelectLabel className="text-xl space-y-2">
            <Separator orientation="horizontal" />
            <div>Pranzo</div>
          </SelectLabel>
          {generateTimeSlots(12, 0, 14, 30).map((time: string) => (
            <SelectItem key={time} value={time} className="text-xl">
              {time}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel className="text-xl space-y-2">
            <Separator orientation="horizontal" />
            <div>Cena</div>
          </SelectLabel>
          {generateTimeSlots(18, 30, 22, 30).map((time: string) => (
            <SelectItem key={time} value={time} className="text-xl">
              {time}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});

export default WhenSelector;
