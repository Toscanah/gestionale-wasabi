import { forwardRef, KeyboardEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";
import generateTimeSlots from "../../util/functions/generateTimeSlots";
import SelectWrapper from "./SelectWrapper";

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
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const lunchTimes = generateTimeSlots(12, 0, 14, 30, currentHour, currentMinute);
    const dinnerTimes = generateTimeSlots(18, 30, 22, 30, currentHour, currentMinute);

    const allTimeSlots = [...lunchTimes, ...dinnerTimes];
    const isValuePresent = value && allTimeSlots.includes(value);

    const additionalGroup =
      value && !isValuePresent && value !== "Subito"
        ? [
            {
              items: [value],
            },
          ]
        : [];

    return (
      <SelectWrapper
        defaultValue="Subito"
        field={field}
        ref={ref}
        onValueChange={onValueChange}
        value={value}
        className={className}
        onKeyDown={onKeyDown}
        groups={[
          ...additionalGroup,
          {
            label: "Subito",
            items: ["Subito"],
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
