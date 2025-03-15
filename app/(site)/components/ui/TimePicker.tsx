"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ClockIcon } from "lucide-react";

interface TimePickerProps {
  value: string | undefined;
  onValueChange: (newTime: string) => void;
}

export default function TimePicker({ value, onValueChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i * 1);

  const handleTimeChange = (type: "hour" | "minute", newValue: number) => {
    const currentTime = value ? value.split(":").map(Number) : [0, 0];
    const updatedTime = type === "hour" ? [newValue, currentTime[1]] : [currentTime[0], newValue];

    onValueChange(updatedTime.map((n) => String(n).padStart(2, "0")).join(":"));
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between">
          <ClockIcon className="mr-2 h-4 w-4" />
          {value || "Seleziona orario"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
          {/* Hours Selection */}
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {hoursArray.map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={Number(value?.split(":")[0]) === hour ? "default" : "ghost"}
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("hour", hour)}
                >
                  {String(hour).padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>

          {/* Minutes Selection */}
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {minutesArray.map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={Number(value?.split(":")[1]) === minute ? "default" : "ghost"}
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("minute", minute)}
                >
                  {String(minute).padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
