import { forwardRef, KeyboardEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";
import generateTimeSlots from "../../util/functions/generateTimeSlots";
import SelectWrapper from "./SelectWrapper";

interface WhenSelectorProps {
  handleKeyDown?: (e: KeyboardEvent<any>) => void;
  className?: string;
  isForm?: boolean;
  field?: ControllerRenderProps;
}

const WhenSelector = forwardRef<HTMLButtonElement, WhenSelectorProps>(
  ({ handleKeyDown, className, field }, ref) => {
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

    return (
      <SelectWrapper
        defaultValue="Subito"
        field={field}
        ref={ref}
        className={className}
        handleKeyDown={handleKeyDown}
        groups={[
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
