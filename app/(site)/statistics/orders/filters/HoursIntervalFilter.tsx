import SelectWrapper from "@/app/(site)/components/select/SelectWrapper";
import { Dispatch, SetStateAction } from "react";
import { HoursInterval } from "../Section";

interface HoursIntervalFilterProps {
  hoursInterval: HoursInterval | undefined;
  setHoursInterval: Dispatch<SetStateAction<HoursInterval | undefined>>;
}

export default function HoursIntervalFilter({
  setHoursInterval,
  hoursInterval,
}: HoursIntervalFilterProps) {
  // Function to generate time intervals
  const generateTimeOptions = (startHour: number, endHour: number): string[] => {
    const times: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes of [0, 15, 30, 45]) {
        times.push(`${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
      }
    }
    return times;
  };

  // Generate times for both ranges
  const lunchTimes = generateTimeOptions(11, 15);
  const dinnerTimes = generateTimeOptions(18, 23);

  return (
    <div className="w-1/2 flex gap-4 items-center">
      <span>Dalle</span>
      <SelectWrapper
        value={hoursInterval?.from}
        onValueChange={(newFrom) =>
          setHoursInterval((prev) => ({ ...prev, from: newFrom, to: prev?.to || "" }))
        }
        className="h-10"
        groups={[
          { label: "Pranzo", items: lunchTimes },
          { label: "Cena", items: dinnerTimes },
        ]}
      />
      <span>alle</span>
      <SelectWrapper
        value={hoursInterval?.to}
        onValueChange={(newTo) =>
          setHoursInterval((prev) => ({ ...prev, to: newTo, from: prev?.from || "" }))
        }
        className="h-10"
        groups={[
          { label: "Pranzo", items: lunchTimes },
          { label: "Cena", items: dinnerTimes },
        ]}
      />
    </div>
  );
}
