import { forwardRef, KeyboardEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";
import generateTimeSlots from "../../util/functions/generateTimeSlots";
import SelectWrapper from "./SelectWrapper";

interface WhenSelectorProps {
  handleKeyDown?: (e: KeyboardEvent<any>) => void;
  onValueChange?: (value: string) => void;
  className?: string;
  value?: string;
  isForm?: boolean;
  field?: ControllerRenderProps;
}

const WhenSelector = forwardRef<HTMLButtonElement, WhenSelectorProps>(
  ({ handleKeyDown, className, field, value, onValueChange }, ref) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const lunchTimes =
      currentHour >= 11 && currentHour < 16
        ? generateTimeSlots(12, 0, 14, 30, currentHour, currentMinute)
        : [];
    const dinnerTimes =
      currentHour >= 16 && currentHour <= 22
        ? generateTimeSlots(18, 30, 22, 30, currentHour, currentMinute)
        : [];

    // Check if the current `value` is valid or has already passed
    const allTimeSlots = [...lunchTimes, ...dinnerTimes];
    const isValuePresent = value && allTimeSlots.includes(value);

    const isBeforeCurrentTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours < currentHour || (hours === currentHour && minutes <= currentMinute);
    };

    // Create a new group if `value` is not present and is before the current time
    const additionalGroup =
      value && !isValuePresent && isBeforeCurrentTime(value)
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
        handleKeyDown={handleKeyDown}
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
