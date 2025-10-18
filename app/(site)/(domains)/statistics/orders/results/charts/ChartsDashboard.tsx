import { OrderContracts, Weekday } from "@/app/(site)/lib/shared";
import { useState } from "react";
import ChartSection from "./ChartSection";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@phosphor-icons/react";

type ChartsDashboardProps = {
  data: OrderContracts.ComputeDailyStats.Output;
  selectedWeekdays: Weekday[];
  sections: { id: number }[];
  setSections: React.Dispatch<React.SetStateAction<{ id: number }[]>>;
  isLoading?: boolean;
};

export default function ChartsDashboard({
  data,
  selectedWeekdays,
  sections,
  setSections,
  isLoading,
}: ChartsDashboardProps) {
  const handleDeleteSection = (id: number) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex overflow-x-auto gap-6">
        <div className="w-full flex flex-nowrap gap-6">
          {sections.map((section) => (
            <div key={section.id} className="flex-shrink-0 w-full max-w-full">
              <ChartSection
                isLoading={isLoading}
                data={data}
                selectedWeekdays={selectedWeekdays}
                onDelete={() => handleDeleteSection(section.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center"></div>
    </div>
  );
}
