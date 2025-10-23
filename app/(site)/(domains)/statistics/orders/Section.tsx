import { DateRange } from "react-day-picker";
import useOrdersStats from "../../../hooks/statistics/useOrdersStats";
import { ReducerActions } from "../../../hooks/statistics/sectionReducer";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import WeekdaysFilter from "../../../components/ui/filters/select/WeekdaysFilter";
import OrderTypesFilter from "../../../components/ui/filters/select/OrderTypesFilter";
import TimeWindowFilter from "@/app/(site)/components/ui/filters/time/TimeWindowFilter";
import SectionResults from "./results/SectionResults";
import ResetTableControlsBtn from "@/app/(site)/components/ui/filters/common/ResetTableControlsBtn";
import TODAY_PERIOD from "@/app/(site)/lib/shared/constants/today-period";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ChartsDashboard from "./results/charts/ChartsDashboard";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SectionProps {
  id: string;
}

export type SelectionProps<T> = {
  selection: T;
  dispatch: React.Dispatch<ReducerActions>;
};

export default function Section({}: SectionProps) {
  const { dispatch, state, disabledFlags, filteredResults, showReset, isLoading, dailyStats } =
    useOrdersStats();

  const [chartSections, setChartSections] = useState<{ id: number }[]>([{ id: Date.now() }]);
  const [showAll, setShowAll] = useState(true);

  const handleAddChartSection = () => {
    setChartSections((prev) => [...prev, { id: Date.now() }]);
  };

  const hasDaily =
    dailyStats &&
    Object.values(dailyStats).some((statsArray) =>
      statsArray.some((s) =>
        Object.entries(s).some(([_, value]) => typeof value === "number" && value > 0)
      )
    );

  const hasNormal =
    filteredResults &&
    Object.values(filteredResults).some((res) => {
      if (!res) return false;

      return Object.entries(res).some(([key, value]) => {
        if (key === "perDay" && typeof value === "object" && value !== null) {
          return Object.values(value).some((v) => typeof v === "number" && v > 0);
        }
        return typeof value === "number" && value > 0;
      });
    });

  console.log("hasNormal:", hasNormal);
  console.log("hasDaily:", hasDaily);

  return (
    <div className="flex flex-col gap-4 w-full p-4 h-full ">
      <div className="w-full flex flex-wrap gap-4 items-center">
        <div className="h-9 flex items-center gap-2 ">
          <Switch id="toggle-tutti" checked={showAll} onCheckedChange={setShowAll} className="" />
          <Label htmlFor="toggle-tutti" className="text-md h-full">
            Tutti?
          </Label>
        </div>

        <OrderTypesFilter
          selectedTypes={state.orderTypes}
          onTypesChange={(updatedTypes) =>
            dispatch({ type: "SET_ORDER_TYPES", payload: updatedTypes })
          }
          disabled={disabledFlags.orderTypes}
        />

        <MinusIcon />

        <CalendarFilter
          usePresets
          useYears
          defaultValue={TODAY_PERIOD}
          mode="range"
          dateFilter={state.period}
          handleDateFilter={(newDate) =>
            dispatch({ type: "SET_PERIOD", payload: newDate as DateRange })
          }
        />

        <WeekdaysFilter
          weekdays={state.weekdays}
          onWeekdaysChange={(updatedWeekdays) =>
            dispatch({
              type: "SET_WEEKDAYS",
              payload: updatedWeekdays,
            })
          }
          disabled={disabledFlags.weekdays}
        />

        <MinusIcon />

        <ShiftFilter
          selectedShift={state.shift}
          onShiftChange={(updatedShift) =>
            dispatch({
              type: "SET_SHIFT",
              payload: updatedShift,
            })
          }
        />

        <TimeWindowFilter
          window={state.timeWindow}
          disabled={disabledFlags.timeWindow}
          onWindowChange={(updatedWindow) =>
            dispatch({
              type: "SET_TIME_WINDOW",
              payload: updatedWindow,
            })
          }
        />

        <ResetTableControlsBtn
          customShow={showReset || showAll === false}
          onReset={() => {
            dispatch({ type: "RESET" });
            setShowAll(true);
            setChartSections([{ id: Date.now() }]);
          }}
        />
      </div>

      {(hasNormal == true ) || isLoading ? (
        <>
          <SectionResults
            filters={state}
            results={filteredResults}
            isLoading={isLoading}
            showAll={showAll}
          />

          <Separator />

          <div className="space-y-4 mt-4">
            <div className="w-full flex gap-4 items-center">
              <Label className="text-md">Grafici ({chartSections.length})</Label>
              <Button variant={"outline"} onClick={handleAddChartSection} className="ml-auto">
                <PlusCircleIcon className="h-4 w-4 " />
                Aggiungi
              </Button>
            </div>

            <ChartsDashboard
              isLoading={isLoading}
              showAll={showAll}
              sections={chartSections}
              setSections={setChartSections}
              data={dailyStats ?? { home: [], pickup: [], table: [] }}
              selectedWeekdays={state.weekdays}
              selectedOrderTypes={state.orderTypes}
            />
          </div>
        </>
      ) : (
        <p className="mt-8 w-full flex items-center justify-center text-md text-muted-foreground">
          Nessun dato disponibile per i filtri selezionati.
        </p>
      )}
    </div>
  );
}
