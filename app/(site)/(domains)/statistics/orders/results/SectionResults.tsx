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

const CSV_HEADERS: Record<keyof CSVCombinedResultRecord, string> = {
  title: "Tipo ordine",
  orders: "Ordini",
  ordersPct: "% Ordini",
  revenue: "Incasso",
  revenuePct: "% Incasso",
  avgPerOrder: "Scontrino medio",
  ordersPerDay: "Ordini/giorno",
  revenuePerDay: "Incasso/giorno",
  productsPerDay: "Prodotti/giorno",
  products: "Prodotti",
  soups: "Zuppe",
  rices: "Porzioni riso",
  salads: "Insalate",
  rice: "Riso cucinato",
  soupsPerDay: "Zuppe/giorno",
  ricesPerDay: "Porzioni riso/giorno",
  saladsPerDay: "Insalate/giorno",
  ricePerDay: "Riso cucinato/giorno",
};

function flattenAverage(r: AverageResultRecord): AverageResultRecordFlat {
  return {
    title: r.title,
    avgPerOrder: r.avgPerOrder,
    ordersPerDay: r.perDay.orders,
    revenuePerDay: r.perDay.revenue,
    productsPerDay: r.perDay.products,
    soupsPerDay: r.perDay.soups,
    ricesPerDay: r.perDay.rices,
    saladsPerDay: r.perDay.salads,
    ricePerDay: r.perDay.rice,
  };
}

export default function SectionResults({ results, isLoading, filters }: SectionResultsProps) {
  // ----- DATA SPLIT -----
  const { generalSections, averageSections } = React.useMemo(() => {
    if (!results) return { generalSections: [], averageSections: [] };

    const {} = results;

    const totalOrders = results.home.orders + results.pickup.orders + results.table.orders;
    const totalRevenue = results.home.revenue + results.pickup.revenue + results.table.revenue;
    const totalSoups = results.home.soups + results.pickup.soups + results.table.soups;
    const totalRices = results.home.rices + results.pickup.rices + results.table.rices;
    const totalSalads = results.home.salads + results.pickup.salads + results.table.salads;
    const totalRice = results.home.rice + results.pickup.rice + results.table.rice;
    const totalProducts = results.home.products + results.pickup.products + results.table.products;

    // helper for percentage
    const pct = (part: number, total: number) =>
      total > 0 ? `${roundToTwo((part / total) * 100)}%` : "0%";

    const makeGeneral = (title: string, r: OrdersStats.Result): GeneralResultRecord => ({
      title,
      orders: r.orders,
      ordersPct: pct(r.orders, totalOrders),
      revenue: r.revenue,
      revenuePct: pct(r.revenue, totalRevenue),
      products: r.products,
      soups: r.soups,
      rices: r.rices,
      salads: r.salads,
      rice: r.rice,
    });

    // General stats
    const generalSections: GeneralResultRecord[] = [
      makeGeneral("Tavoli", results.table),
      makeGeneral("Asporto", results.pickup),
      makeGeneral("Domicilio", results.home),
      {
        title: "Tutti",
        orders: totalOrders,
        ordersPct: "100%",
        revenue: totalRevenue,
        revenuePct: "100%",
        products: totalProducts,
        soups: totalSoups,
        rices: totalRices,
        salads: totalSalads,
        rice: totalRice,
      },
    ];

    const makeAverage = (title: string, r: OrdersStats.Result): AverageResultRecord => ({
      title,
      avgPerOrder: r.revenuePerOrder,
      perDay: {
        ...r.perDay,
      },
    });

    // Average stats
    const averageSections: AverageResultRecord[] = [
      makeAverage("Tavoli", results.table),
      makeAverage("Asporto", results.pickup),
      makeAverage("Domicilio", results.home),
      {
        title: "Tutti",
        avgPerOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        perDay: {
          orders:
            results.home.perDay.orders + results.pickup.perDay.orders + results.table.perDay.orders,
          revenue:
            results.home.perDay.revenue +
            results.pickup.perDay.revenue +
            results.table.perDay.revenue,
          products:
            results.home.perDay.products +
            results.pickup.perDay.products +
            results.table.perDay.products,
          soups:
            results.home.perDay.soups + results.pickup.perDay.soups + results.table.perDay.soups,
          rices:
            results.home.perDay.rices + results.pickup.perDay.rices + results.table.perDay.rices,
          salads:
            results.home.perDay.salads + results.pickup.perDay.salads + results.table.perDay.salads,
          rice: results.home.perDay.rice + results.pickup.perDay.rice + results.table.perDay.rice,
        },
      },
    ];

    return { generalSections, averageSections };
  }, [results]);

  // filters just for CSV (still present but unused elsewhere)
  const parsedWeekdays =
    filters.weekdays.length >= 6
      ? "Tutti"
      : filters.weekdays
          .map((n: number) => {
            const idx = (n - 1) as Weekday;
            return WEEKDAY_LABELS[idx] || "";
          })
          .filter(Boolean)
          .join(", ");

  const formatTimeWindow = (timeWindow?: { from: string; to: string }) => {
    if (!timeWindow || !timeWindow.from || !timeWindow.to) return undefined;
    return `dalle ${timeWindow.from} alle ${timeWindow.to}`;
  };

  const parsedFilters: Record<string, string | number | null | undefined> = {
    Periodo: formatDateFilter("range", filters.period),
    Turno: SHIFT_LABELS[filters.shift],
    Giorni: parsedWeekdays,
    Orario: formatTimeWindow(filters.timeWindow),
  };

  const flatAverageSections: AverageResultRecordFlat[] = averageSections.map(flattenAverage);

  // const { downloadCsv } = useCsvExport<CSVCombinedResultRecord>(
  //   [...generalSections, ...flatAverageSections],
  //   CSV_HEADERS,
  //   parsedFilters
  // );
  // ----- TABLES -----
  const { tableData: generalData, tableColumns: generalColumns } = useSkeletonTable({
    isLoading,
    data: generalSections,
    columns: generalStatsColumns,
    pageSize: generalSections.length || 4,
  });
  const generalTable = useTable({ data: generalData, columns: generalColumns });

  const { tableData: averageData, tableColumns: averageColumns } = useSkeletonTable({
    isLoading,
    data: averageSections,
    columns: averageStatsColumns,
    pageSize: averageSections.length || 4,
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
