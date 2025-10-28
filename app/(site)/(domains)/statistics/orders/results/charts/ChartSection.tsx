import { OrderContracts, OrdersStats, Weekday, WEEKDAY_LABELS } from "@/app/(site)/lib/shared";
import { useState, useEffect } from "react";
import DailyChart from "./DailyChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import WasabiUniversalSelect from "@/app/(site)/components/ui/wasabi/WasabiUniversalSelect ";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderType } from "@prisma/client";
import {
  ChartLineIcon,
  CompassToolIcon,
  GearIcon,
  PackageIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export type Metric = keyof OrdersStats.DailyRow;

export const METRICS: { label: string; metric: Metric; format?: "currency" }[] = [
  { label: "Ordini", metric: "orders" },
  { label: "Incasso (€)", metric: "revenue", format: "currency" },
  { label: "Prodotti", metric: "products" },
  { label: "Zuppe", metric: "soups" },
  { label: "Porzioni riso", metric: "rices" },
  { label: "Insalate", metric: "salads" },
  { label: "Riso", metric: "rice" },
  { label: "Scontrino medio (€)", metric: "revenuePerOrder", format: "currency" },
];

function filterByWeekday(
  data: OrderContracts.ComputeDailyStats.Output,
  weekday: Weekday
): OrderContracts.ComputeDailyStats.Output {
  const filterFn = (r: any) => new Date(r.day).getDay() === weekday;
  return {
    home: (data.home ?? []).filter(filterFn),
    pickup: (data.pickup ?? []).filter(filterFn),
    table: (data.table ?? []).filter(filterFn),
  };
}

type ChartSectionProps = {
  data: OrderContracts.ComputeDailyStats.Output;
  selectedWeekdays: Weekday[];
  selectedOrderTypes: OrdersStats.LowerOrderTypeEnum[];
  onDelete: () => void;
  isLoading?: boolean;
  showAll: boolean;
};

export type ChartMode = "esplicito" | "andamento";
export type ChartType = "line" | "pie";

export default function ChartSection({
  data,
  selectedWeekdays,
  selectedOrderTypes,
  onDelete,
  isLoading,
  showAll,
}: ChartSectionProps) {
  const [metric, setMetric] = useState<Metric>("orders");
  const [mode, setMode] = useState<ChartMode>("esplicito");
  const [type, setType] = useState<ChartType>("line");

  useEffect(() => {
    if (type === "pie" && metric === "revenuePerOrder") {
      setMetric(METRICS[0].metric);
    }
  }, [type, metric]);

  const metricLabel = METRICS.find((m) => m.metric === metric)?.label ?? "";

  // --- Filter logic for weekday selection ---
  const isSingleWeekday = selectedWeekdays.length === 1;
  const chartLabel = isSingleWeekday
    ? `${metricLabel} (${WEEKDAY_LABELS[selectedWeekdays[0]] ?? selectedWeekdays[0]})`
    : metricLabel;
  const chartData = isSingleWeekday ? filterByWeekday(data, selectedWeekdays[0]) : data;

  const mergedVisibleTypes: OrdersStats.ResultsKeyEnum[] =
    showAll && selectedOrderTypes.length > 1 && type !== "pie"
      ? [...selectedOrderTypes, "tutti"]
      : selectedOrderTypes;

  const allChart = (
    <DailyChart
      visibleTypes={mergedVisibleTypes}
      isLoading={isLoading}
      label={chartLabel}
      key="all"
      title={
        isSingleWeekday
          ? (WEEKDAY_LABELS[selectedWeekdays[0]] ?? selectedWeekdays[0])
          : selectedWeekdays.map((day) => WEEKDAY_LABELS[day] ?? day).join(" + ")
      }
      type={type}
      data={chartData}
      metric={metric}
      mode={mode}
    />
  );

  const weekdayCharts = selectedWeekdays.map((dayNum) => (
    <DailyChart
      visibleTypes={mergedVisibleTypes}
      id="weekday"
      isLoading={isLoading}
      type={type}
      mode={mode}
      label={metricLabel}
      key={dayNum}
      title={`${WEEKDAY_LABELS[dayNum] ?? dayNum}`}
      data={filterByWeekday(data, dayNum)}
      metric={metric}
    />
  ));

  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle className="flex gap-6 items-center">
          {isLoading ? (
            <Skeleton className="h-9 w-full rounded-lg" />
          ) : (
            <>
              <WasabiUniversalSelect
                searchPlaceholder="Cerca campo..."
                triggerIcon={CompassToolIcon}
                disabled={isLoading}
                triggerClassName="flex-1"
                appearance="filter"
                title="Campo"
                mode="single"
                shouldClear={false}
                selectedValue={metric}
                onChange={(value) => setMetric(value as Metric)}
                groups={[
                  {
                    options: METRICS.map((m) => ({
                      label: m.label,
                      value: m.metric,
                      disabled: type === "pie" && m.metric === "revenuePerOrder",
                    })),
                  },
                ]}
              />

              <WasabiUniversalSelect
                disabled={isLoading}
                triggerIcon={ChartLineIcon}
                shouldClear={false}
                triggerClassName="flex-1"
                appearance="filter"
                searchPlaceholder="Cerca grafico..."
                title="Tipo grafico"
                mode="single"
                selectedValue={type}
                onChange={(value) => setType(value as ChartType)}
                groups={[
                  {
                    options: [
                      { label: "Linea", value: "line" },
                      { label: "A torta", value: "pie" },
                    ],
                  },
                ]}
              />

              <WasabiUniversalSelect
                triggerIcon={GearIcon}
                disabled={type === "pie" || isLoading}
                shouldClear={false}
                triggerClassName="flex-1"
                appearance="filter"
                searchPlaceholder="Cerca modalità..."
                title="Modalità"
                mode="single"
                selectedValue={mode}
                onChange={(value) => setMode(value as ChartMode)}
                groups={[
                  {
                    options: [
                      { label: "Esplicito", value: "esplicito" },
                      { label: "Andamento", value: "andamento" },
                    ],
                  },
                ]}
              />

              <Button onClick={onDelete}>
                <TrashIcon className="h-4 w-4" /> Rimuovi grafico
              </Button>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="popLayout">
          <div
            className="
              grid gap-6 w-full
              grid-cols-6
              auto-rows-max
              [grid-auto-flow:row_dense]
            "
          >
            <motion.div
              key="all"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="col-span-6 w-full min-w-0"
            >
              {allChart}
            </motion.div>

            {!isSingleWeekday &&
              weekdayCharts.length > 0 &&
              weekdayCharts.map((chart, i) => {
                const len = weekdayCharts.length;
                let colSpanClass = "col-span-2";
                switch (len) {
                  case 1:
                    colSpanClass = "col-span-6";
                    break;
                  case 2:
                    colSpanClass = "col-span-3";
                    break;
                  case 3:
                    colSpanClass = "col-span-2";
                    break;
                  case 4:
                    colSpanClass = "col-span-3";
                    break;
                  case 5:
                    colSpanClass = i < 3 ? "col-span-2" : "col-span-3";
                    break;
                  case 6:
                    colSpanClass = "col-span-2";
                    break;
                  case 7:
                    colSpanClass = i < 4 ? "col-span-2" : "col-span-3";
                    break;
                }

                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`${colSpanClass} min-w-0`}
                  >
                    {chart}
                  </motion.div>
                );
              })}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
