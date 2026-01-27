import React from "react";
import roundToTwo from "../../../../../../lib/shared/utils/global/number/roundToTwo";
import useTable from "@/hooks/table/useTable";
import generalStatsColumns from "./generalStatsColumns";
import Table from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import useSkeletonTable from "@/hooks/table/useSkeletonTable";
import { OrderFilters } from "@/hooks/statistics/sectionReducer";
import { Label } from "@/components/ui/label";
import averageStatsColumns from "./averageStatsColumns";
import { OrdersStats } from "@/lib/shared";
import { Separator } from "@/components/ui/separator";
import TableColumnsVisibility from "@/components/table/TableColumnsVisibility";
import useCsvExport from "@/hooks/csv-export/useCsvExport";
import { MinusIcon } from "@phosphor-icons/react";
import CsvExportButton from "@/components/shared/misc/CsvExportButton";
import { EmDash } from "@/components/shared/misc/Placeholders";
import { isSameDay, startOfDay } from "date-fns";

type MetricsResult = OrdersStats.Metrics;

interface SectionResultsProps {
  results: OrdersStats.Results | null;
  isLoading: boolean;
  filters: OrderFilters;
  showAll: boolean;
}

export type GeneralResultRecord = {
  title: string;
  ordersPct: string;
  revenuePct: string;
} & MetricsResult;

export type AverageResultRecord = {
  title: string;
  avgPerOrder: number;
} & OrdersStats.Daily;

type AverageResultRecordFlat = Omit<AverageResultRecord, "perDay"> & {
  [K in keyof OrdersStats.Daily["perDay"] as `${K & string}PerDay`]: OrdersStats.Daily["perDay"][K];
};

export default function SectionResults({
  results,
  isLoading,
  filters,
  showAll,
}: SectionResultsProps) {
  const { generalSections, averageSections } = React.useMemo(() => {
    if (!results) return { generalSections: [], averageSections: [] };

    const safeResults = {
      table: results.table ?? null,
      pickup: results.pickup ?? null,
      home: results.home ?? null,
      tutti: results.tutti ?? null,
    };

    // ✅ Exclude "tutti" when computing totals
    const entriesForTotals = Object.entries(safeResults).filter(
      ([key, val]) => val !== null && key !== "tutti"
    );

    const totalOrders = entriesForTotals.reduce((sum, [_key, r]) => sum + (r?.orders ?? 0), 0);
    const totalRevenue = entriesForTotals.reduce((sum, [_key, r]) => sum + (r?.revenue ?? 0), 0);

    const pct = (part: number, total: number) =>
      total > 0 ? `${roundToTwo((part / total) * 100)}%` : "0%";

    const makeGeneral = (title: string, r: OrdersStats.Result): GeneralResultRecord => ({
      title,
      orders: r.orders,
      ordersPct: title === "Tutti" ? "100%" : pct(r.orders, totalOrders),
      revenue: r.revenue,
      revenuePct: title === "Tutti" ? "100%" : pct(r.revenue, totalRevenue),
      products: r.products,
      soups: r.soups,
      rices: r.rices,
      salads: r.salads,
      rice: r.rice,
    });

    const makeAverage = (title: string, r: OrdersStats.Result): AverageResultRecord => ({
      title,
      avgPerOrder: r.revenuePerOrder,
      perDay: { ...r.perDay },
    });

    const generalSections: GeneralResultRecord[] = [];
    const averageSections: AverageResultRecord[] = [];

    if (safeResults.table)
      (generalSections.push(makeGeneral("Tavoli", safeResults.table)),
        averageSections.push(makeAverage("Tavoli", safeResults.table)));

    if (safeResults.pickup)
      (generalSections.push(makeGeneral("Asporto", safeResults.pickup)),
        averageSections.push(makeAverage("Asporto", safeResults.pickup)));

    if (safeResults.home)
      (generalSections.push(makeGeneral("Domicilio", safeResults.home)),
        averageSections.push(makeAverage("Domicilio", safeResults.home)));

    if (safeResults.tutti && showAll)
      (generalSections.push(makeGeneral("Tutti", safeResults.tutti)),
        averageSections.push(makeAverage("Tutti", safeResults.tutti)));

    return { generalSections, averageSections };
  }, [results, showAll]);

  const pageSize = filters.orderTypes.length == 1 ? 1 : filters.orderTypes.length + 1;

  const { tableData: generalData, tableColumns: generalColumns } = useSkeletonTable({
    isLoading,
    data: generalSections,
    columns: generalStatsColumns,
    pageSize,
  });
  const generalTable = useTable({ data: generalData, columns: generalColumns });

  const { tableData: averageData, tableColumns: averageColumns } = useSkeletonTable({
    isLoading,
    data: averageSections,
    columns: averageStatsColumns,
    pageSize,
  });
  const averageTable = useTable({ data: averageData, columns: averageColumns });

  const { exportCsv: exportCsvGeneral } = useCsvExport(generalTable);
  const { exportCsv: exportCsvAverage } = useCsvExport(averageTable);

  const parsedFilters = {
    orderBase: {
      period: filters.period as any,
      shift: filters.shift,
      weekdays: filters.weekdays,
      orderTypes: filters.orderTypes,
      timeWindow: filters.timeWindow,
    },
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-col gap-4">
        <Separator />

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <CsvExportButton
                disabled={isLoading}
                onClick={() => exportCsvGeneral({ filters: parsedFilters })}
              />

              <EmDash />

              <Label className="text-lg self-center uppercase">Dati generali</Label>
            </div>
            <TableColumnsVisibility table={generalTable} blacklist={["title"]} />
          </div>
          <Table table={generalTable} fixedColumnIndexes={[0]} />
        </div>

        {filters.period?.from &&
          filters.period?.to &&
          !isSameDay(filters.period.from, filters.period.to) && (
            <>
              <Separator />

              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <CsvExportButton
                      disabled={isLoading}
                      onClick={() => exportCsvAverage({ filters: parsedFilters })}
                    />

                    <EmDash />

                    <Label className="text-lg self-center uppercase">Medie</Label>
                  </div>
                  <TableColumnsVisibility table={averageTable} />
                </div>
                <Table table={averageTable} fixedColumnIndexes={[0]} />
              </div>
            </>
          )}
      </div>
    </div>
  );
}
