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

    const allTimeSlots = [...lunchTimes, ...dinnerTimes];
    const isValuePresent = value && allTimeSlots.includes(value);

    const isBeforeCurrentTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);

      // Create a Date object for the selected time and the current time
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0); // Set to the selected time

      const currentTime = new Date(); // Current time is now

      // Check if the selected time is before the current time
      return selectedTime < currentTime;
    };

    //console.log(isBeforeCurrentTime(value ?? ""));

    const additionalGroup =
      value && !isValuePresent 
        ? [
            {
              items: [value],
            },
          ]
        : [];

    console.log(additionalGroup);

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
