import { OrderContracts, OrdersStats, Weekday } from "@/app/(site)/lib/shared";
import ChartSection from "./ChartSection";
import { OrderType } from "@/prisma/generated/client/enums";

type ChartsDashboardProps = {
  data: OrderContracts.ComputeDailyStats.Output;
  selectedWeekdays: Weekday[];
  selectedOrderTypes: OrderType[];
  sections: { id: number }[];
  setSections: React.Dispatch<React.SetStateAction<{ id: number }[]>>;
  isLoading?: boolean;
  showAll: boolean;
};

export default function ChartsDashboard({
  data,
  selectedWeekdays,
  selectedOrderTypes,
  sections,
  setSections,
  isLoading,
  showAll
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
                showAll={showAll}
                isLoading={isLoading}
                data={data}
                selectedOrderTypes={selectedOrderTypes.map(
                  (type) => type.toLowerCase() as OrdersStats.LowerOrderTypeEnum
                )}
                selectedWeekdays={selectedWeekdays}
                onDelete={() => handleDeleteSection(section.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
