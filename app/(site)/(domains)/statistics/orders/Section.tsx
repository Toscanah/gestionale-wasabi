import { DateRange } from "react-day-picker";
import useOrdersStats from "../../../hooks/statistics/useOrdersStats";
import { ReducerActions } from "../../../hooks/statistics/sectionReducer";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import WeekdaysFilter from "../../../components/ui/filters/select/WeekdaysFilter";
import OrderTypesFilter from "../../../components/ui/filters/select/OrderTypesFilter";
import TimeWindowFilter from "@/app/(site)/components/ui/filters/time/TimeWindowFilter";
import SectionResults from "./results/SectionResults";
import { Separator } from "@/components/ui/separator";
import ResetTableControlsBtn from "@/app/(site)/components/ui/filters/common/ResetTableControlsBtn";
import useCsvExport from "@/app/(site)/hooks/useCsvExport";
import TODAY_PERIOD from "@/app/(site)/lib/shared/constants/today-period";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ChartsDashboard from "./results/charts/ChartsDashboard";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import RandomSpinner from "@/app/(site)/components/ui/misc/loader/RandomSpinner";

interface SectionProps {
  id: string;
}

export type SelectionProps<T> = {
  selection: T;
  dispatch: React.Dispatch<ReducerActions>;
};

type OrderStatsShowing = {
  general: boolean;
  average: boolean;
  chart: boolean;
};

export default function Section({}: SectionProps) {
  const { dispatch, state, disabledFlags, filteredResults, showReset, isLoading, dailyStats } =
    useOrdersStats();

  const [chartSections, setChartSections] = useState<{ id: number }[]>([{ id: Date.now() }]);

  const handleAddChartSection = () => {
    setChartSections((prev) => [...prev, { id: Date.now() }]);
  };

  const hasDaily =
    dailyStats &&
    Object.values(dailyStats).some((statsArray) =>
      statsArray.some((s) =>
        Object.entries(s).some(([key, value]) => typeof value === "number" && value > 0)
      )
    );

  const hasNormal =
    filteredResults &&
    Object.values(filteredResults).some((res) =>
      Object.entries(res).some(([key, value]) => {
        if (key === "perDay" && typeof value === "object" && value !== null) {
          return Object.values(value).some((v) => typeof v === "number" && v > 0);
        }
        return typeof value === "number" && value > 0;
      })
    );

  return (
    <div className="flex flex-col gap-4 w-full p-4 h-full">
      <div className="w-full flex flex-wrap gap-4">
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

        <ResetTableControlsBtn customShow={showReset} onReset={() => dispatch({ type: "RESET" })} />
      </div>

      {(hasNormal == true && hasDaily == true) || isLoading ? (
        <>
          <SectionResults filters={state} results={filteredResults} isLoading={isLoading} />

          <div className="space-y-4 mt-4">
            <div className="w-full flex gap-4 items-center">
              <Label className="text-md">Grafici ({chartSections.length})</Label>
              <Button variant={"outline"} onClick={handleAddChartSection}>
                <PlusCircleIcon className="h-4 w-4 " />
                Aggiungi
              </Button>
            </div>

            <ChartsDashboard
              isLoading={isLoading}
              sections={chartSections}
              setSections={setChartSections}
              data={dailyStats ?? { home: [], pickup: [], table: [] }}
              selectedWeekdays={state.weekdays}
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
