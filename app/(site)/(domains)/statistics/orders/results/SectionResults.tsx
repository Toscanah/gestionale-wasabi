import React, { useEffect } from "react";
import roundToTwo from "../../../../lib/utils/global/number/roundToTwo";
import useTable from "@/app/(site)/hooks/table/useTable";
import generalStatsColumns from "./generalStatsColumns";
import Table from "@/app/(site)/components/table/Table";
import { Button } from "@/components/ui/button";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";
import useCsvExport from "@/app/(site)/hooks/useCsvExport";
import { OrderFilters } from "@/app/(site)/hooks/statistics/sectionReducer";
import formatDateFilter from "@/app/(site)/lib/utils/global/date/formatDateFilter";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import averageStatsColumns from "./averageStatsColumns";
import { OrdersStats, SHIFT_LABELS, Weekday, WEEKDAY_LABELS } from "@/app/(site)/lib/shared";
import { Separator } from "@/components/ui/separator";
import TableColumnsVisibility from "@/app/(site)/components/table/TableColumnsVisibility";

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

type CSVCombinedResultRecord = GeneralResultRecord & AverageResultRecordFlat;

// const CSV_HEADERS: Record<keyof CSVCombinedResultRecord, string> = {
//   title: "Tipo ordine",
//   orders: "Ordini",
//   ordersPct: "% Ordini",
//   revenue: "Incasso",
//   revenuePct: "% Incasso",
//   avgPerOrder: "Scontrino medio",
//   ordersPerDay: "Ordini/giorno",
//   revenuePerDay: "Incasso/giorno",
//   productsPerDay: "Prodotti/giorno",
//   products: "Prodotti",
//   soups: "Zuppe",
//   rices: "Porzioni riso",
//   salads: "Insalate",
//   rice: "Riso cucinato",
//   soupsPerDay: "Zuppe/giorno",
//   ricesPerDay: "Porzioni riso/giorno",
//   saladsPerDay: "Insalate/giorno",
//   ricePerDay: "Riso cucinato/giorno",
// };

// function flattenAverage(r: AverageResultRecord): AverageResultRecordFlat {
//   return {
//     title: r.title,
//     avgPerOrder: r.avgPerOrder,
//     ordersPerDay: r.perDay.orders,
//     revenuePerDay: r.perDay.revenue,
//     productsPerDay: r.perDay.products,
//     soupsPerDay: r.perDay.soups,
//     ricesPerDay: r.perDay.rices,
//     saladsPerDay: r.perDay.salads,
//     ricePerDay: r.perDay.rice,
//   };
// }

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

    // ✅ Force "Tutti" to 100%
    if (safeResults.tutti && showAll)
      (generalSections.push(makeGeneral("Tutti", safeResults.tutti)),
        averageSections.push(makeAverage("Tutti", safeResults.tutti)));

    return { generalSections, averageSections };
  }, [results, showAll]);

  // const parsedWeekdays =
  //   filters.weekdays.length >= 6
  //     ? "Tutti"
  //     : filters.weekdays
  //         .map((n: number) => {
  //           const idx = (n - 1) as Weekday;
  //           return WEEKDAY_LABELS[idx] || "";
  //         })
  //         .filter(Boolean)
  //         .join(", ");

  // const formatTimeWindow = (timeWindow?: { from: string; to: string }) => {
  //   if (!timeWindow || !timeWindow.from || !timeWindow.to) return undefined;
  //   return `dalle ${timeWindow.from} alle ${timeWindow.to}`;
  // };

  // const parsedFilters: Record<string, string | number | null | undefined> = {
  //   Periodo: formatDateFilter("range", filters.period),
  //   Turno: SHIFT_LABELS[filters.shift],
  //   Giorni: parsedWeekdays,
  //   Orario: formatTimeWindow(filters.timeWindow),
  // };

  // const flatAverageSections: AverageResultRecordFlat[] = averageSections.map(flattenAverage);

  // const { downloadCsv } = useCsvExport<CSVCombinedResultRecord>(
  //   [...generalSections, ...flatAverageSections],
  //   CSV_HEADERS,
  //   parsedFilters
  // );

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-col gap-4">
        <Separator />

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <Label className="text-md self-end">Dati generali</Label>
            <TableColumnsVisibility table={generalTable} blacklist={["title"]} />
          </div>
          <Table table={generalTable} fixedColumnIndex={0} />
        </div>

        <Separator />

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <Label className="text-md self-end">Medie</Label>
            <TableColumnsVisibility table={averageTable} />
          </div>
          <Table table={averageTable} fixedColumnIndex={0} />
        </div>
      </div>
    </div>
  );
}
