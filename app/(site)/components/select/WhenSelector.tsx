import { forwardRef, KeyboardEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";
import generateTimeSlots from "../../util/functions/generateTimeSlots";
import SelectWrapper from "./SelectWrapper";
import { addHours, subHours } from "date-fns";

interface WhenSelectorProps {
  className?: string;
  value?: string;
  field?: ControllerRenderProps;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
  onValueChange?: (value: string) => void;
}

const WhenSelector = forwardRef<HTMLButtonElement, WhenSelectorProps>(
  ({ className, field, value, onValueChange, onKeyDown }, ref) => {
    const now = new Date();

    // const currentHour = subHours(now.getHours(), 12).getHours();
    // const currentMinute = subHours(now.getMinutes(), 12).getHours();

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const lunchTimes = generateTimeSlots(12, 0, 14, 30, currentHour, currentMinute);
    const dinnerTimes = generateTimeSlots(18, 30, 22, 30, currentHour, currentMinute);

    const allTimeSlots = [...lunchTimes, ...dinnerTimes];
    const isValuePresent = value && allTimeSlots.includes(value);

    const additionalGroup =
      value && !isValuePresent && value !== "immediate"
        ? [
            {
              items: [value],
            },
          ]
        : [];

    return (
      <SelectWrapper
        field={field}
        ref={ref}
        onValueChange={onValueChange}
        value={value}
        className={className}
        onKeyDown={onKeyDown}
        defaultValue="immediate"
        groups={[
          ...additionalGroup,
          {
            label: "*",
            items: [{ name: "Subito", value: "immediate" }],
          },
          ...(lunchTimes.length > 0
            ? [
                {
                  label: "Pranzo",
                  items: lunchTimes,
                },
              ]
            : []),
          ...(dinnerTimes.length > 0
            ? [
                {
                  label: "Cena",
                  items: dinnerTimes,
                },
              ]
            : []),
        ]}
      />
    );
  }
);

export default WhenSelector;
