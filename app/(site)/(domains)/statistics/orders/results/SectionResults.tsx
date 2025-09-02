import React, { useEffect } from "react";
import { OrderStatsResults } from "../../../../hooks/statistics/useOrdersStats";
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
import { SHIFT_LABELS, ShiftFilterValue } from "@/app/(site)/lib/shared";
import { Weekday, WEEKDAY_LABELS } from "@/app/(site)/components/ui/filters/select/WeekdaysFilter";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import averageStatsColumns from "./averageStatsColumns";

interface SectionResultsProps {
  results: OrderStatsResults | null;
  isLoading: boolean;
  filters: OrderFilters;
}

export type ResultRecord = {
  title: string;
  orders: number;
  ordersPct: string;
  revenue: string;
  revenuePct: string;
  avgPerOrder: string;
  ordersPerDay: string;
  revenuePerDay: string;
  productsPerDay: string;
  products: number;
  soups: number;
  rices: number;
  salads: number;
  riceMass: string;

  // --- new per-day stats ---
  soupsPerDay: string;
  ricesPerDay: string;
  saladsPerDay: string;
  riceMassPerDay: string;
};

const CSV_HEADERS: Record<keyof ResultRecord, string> = {
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
  riceMass: "Riso cucinato",

  // --- new per-day stats ---
  soupsPerDay: "Zuppe/giorno",
  ricesPerDay: "Porzioni riso/giorno",
  saladsPerDay: "Insalate/giorno",
  riceMassPerDay: "Riso cucinato/giorno",
};

// helper
function pct(part: number, total: number) {
  return total > 0 ? `${roundToTwo((part / total) * 100)}%` : "0%";
}

export default function SectionResults({ results, isLoading, filters }: SectionResultsProps) {
  const [showGeneral, setShowGeneral] = React.useState(true);
  const [showAverage, setShowAverage] = React.useState(false);

  // ----- DATA SPLIT -----
  const { generalSections, averageSections } = React.useMemo(() => {
    if (!results) return { generalSections: [], averageSections: [] };

    const {
      homeOrders,
      pickupOrders,
      tableOrders,
      homeRevenue,
      pickupRevenue,
      tableRevenue,
      homeSoups,
      homeRices,
      homeSalads,
      homeRice,
      pickupSoups,
      pickupRices,
      pickupSalads,
      pickupRice,
      tableSoups,
      tableRices,
      tableSalads,
      tableRice,
      homeProducts,
      pickupProducts,
      tableProducts,
      homeOrdersPerDay,
      homeRevenuePerDay,
      homeProductsPerDay,
      pickupOrdersPerDay,
      pickupRevenuePerDay,
      pickupProductsPerDay,
      tableOrdersPerDay,
      tableRevenuePerDay,
      tableProductsPerDay,
      homeRevenuePerOrder,
      pickupRevenuePerOrder,
      tableRevenuePerOrder,
      homeRiceMassPerDay,
      pickupRiceMassPerDay,
      tableRiceMassPerDay,
      homeRicesPerDay,
      pickupRicesPerDay,
      tableRicesPerDay,
      homeSaladsPerDay,
      pickupSaladsPerDay,
      tableSaladsPerDay,
      homeSoupsPerDay,
      pickupSoupsPerDay,
      tableSoupsPerDay,
    } = results;

    const totalOrders = homeOrders + pickupOrders + tableOrders;
    const totalRevenue = homeRevenue + pickupRevenue + tableRevenue;
    const totalSoups = homeSoups + pickupSoups + tableSoups;
    const totalRices = homeRices + pickupRices + tableRices;
    const totalSalads = homeSalads + pickupSalads + tableSalads;
    const totalRiceMass = homeRice + pickupRice + tableRice;
    const totalProducts = homeProducts + pickupProducts + tableProducts;

    // helper for percentage
    const pct = (part: number, total: number) =>
      total > 0 ? `${roundToTwo((part / total) * 100)}%` : "0%";

    // General stats
    const generalSections: ResultRecord[] = [
      {
        title: "Tavoli",
        orders: tableOrders,
        ordersPct: pct(tableOrders, totalOrders),
        revenue: roundToTwo(tableRevenue),
        revenuePct: pct(tableRevenue, totalRevenue),
        products: tableProducts,
        soups: tableSoups,
        rices: tableRices,
        salads: tableSalads,
        riceMass: formatRice(tableRice),
      },
      {
        title: "Asporto",
        orders: pickupOrders,
        ordersPct: pct(pickupOrders, totalOrders),
        revenue: roundToTwo(pickupRevenue),
        revenuePct: pct(pickupRevenue, totalRevenue),
        products: pickupProducts,
        soups: pickupSoups,
        rices: pickupRices,
        salads: pickupSalads,
        riceMass: formatRice(pickupRice),
      },
      {
        title: "Domicilio",
        orders: homeOrders,
        ordersPct: pct(homeOrders, totalOrders),
        revenue: roundToTwo(homeRevenue),
        revenuePct: pct(homeRevenue, totalRevenue),
        products: homeProducts,
        soups: homeSoups,
        rices: homeRices,
        salads: homeSalads,
        riceMass: formatRice(homeRice),
      },
      {
        title: "Tutti",
        orders: totalOrders,
        ordersPct: "100%",
        revenue: roundToTwo(totalRevenue),
        revenuePct: "100%",
        products: totalProducts,
        soups: totalSoups,
        rices: totalRices,
        salads: totalSalads,
        riceMass: formatRice(totalRiceMass),
      },
    ] as any;

    // Average stats
    const averageSections: ResultRecord[] = [
      {
        title: "Tavoli",
        avgPerOrder: roundToTwo(tableRevenuePerOrder),
        ordersPerDay: roundToTwo(tableOrdersPerDay),
        revenuePerDay: roundToTwo(tableRevenuePerDay),
        productsPerDay: roundToTwo(tableProductsPerDay),
        soupsPerDay: roundToTwo(tableSoupsPerDay),
        ricesPerDay: roundToTwo(tableRicesPerDay),
        saladsPerDay: roundToTwo(tableSaladsPerDay),
        riceMassPerDay: roundToTwo(tableRiceMassPerDay),
      },
      {
        title: "Asporto",
        avgPerOrder: roundToTwo(pickupRevenuePerOrder),
        ordersPerDay: roundToTwo(pickupOrdersPerDay),
        revenuePerDay: roundToTwo(pickupRevenuePerDay),
        productsPerDay: roundToTwo(pickupProductsPerDay),
        soupsPerDay: roundToTwo(pickupSoupsPerDay),
        ricesPerDay: roundToTwo(pickupRicesPerDay),
        saladsPerDay: roundToTwo(pickupSaladsPerDay),
        riceMassPerDay: roundToTwo(pickupRiceMassPerDay),
      },
      {
        title: "Domicilio",
        avgPerOrder: roundToTwo(homeRevenuePerOrder),
        ordersPerDay: roundToTwo(homeOrdersPerDay),
        revenuePerDay: roundToTwo(homeRevenuePerDay),
        productsPerDay: roundToTwo(homeProductsPerDay),
        soupsPerDay: roundToTwo(homeSoupsPerDay),
        ricesPerDay: roundToTwo(homeRicesPerDay),
        saladsPerDay: roundToTwo(homeSaladsPerDay),
        riceMassPerDay: roundToTwo(homeRiceMassPerDay),
      },
      {
        title: "Tutti",
        avgPerOrder: roundToTwo(totalOrders > 0 ? totalRevenue / totalOrders : 0),
        ordersPerDay: roundToTwo(homeOrdersPerDay + pickupOrdersPerDay + tableOrdersPerDay),
        revenuePerDay: roundToTwo(homeRevenuePerDay + pickupRevenuePerDay + tableRevenuePerDay),
        productsPerDay: roundToTwo(homeProductsPerDay + pickupProductsPerDay + tableProductsPerDay),
        soupsPerDay: roundToTwo(homeSoupsPerDay + pickupSoupsPerDay + tableSoupsPerDay),
        ricesPerDay: roundToTwo(homeRicesPerDay + pickupRicesPerDay + tableRicesPerDay),
        saladsPerDay: roundToTwo(homeSaladsPerDay + pickupSaladsPerDay + tableSaladsPerDay),
        riceMassPerDay: roundToTwo(homeRiceMassPerDay + pickupRiceMassPerDay + tableRiceMassPerDay),
      },
    ] as any;

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
      <div className="w-full flex gap-4 items-center">
        {!showGeneral && !showAverage && (
          <div className="w-full text-center text-muted-foreground items-center justify-center py-16">
            Seleziona almeno un tipo di dato
          </div>
        )}

        {showGeneral && (
          <Table table={generalTable} fixedColumnIndex={0} cellClassName={() => "h-20 max-h-20"} />
        )}
        {showAverage && (
          <Table table={averageTable} fixedColumnIndex={0} cellClassName={() => "h-20 max-h-20"} />
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2 items-center">
          <Checkbox
            id="show-general"
            checked={showGeneral}
            onCheckedChange={() => setShowGeneral(!showGeneral)}
          />
          <Label className="flex items-center gap-2" htmlFor="show-general">
            Dati generali
          </Label>
        </div>

        <div className="flex gap-2 items-center">
          <Checkbox
            id="show-average"
            checked={showAverage}
            onCheckedChange={() => setShowAverage(!showAverage)}
          />
          <Label className="flex items-center gap-2" htmlFor="show-average">
            Medie
          </Label>
        </div>

        <Button className="ml-auto" disabled={isLoading || (!showGeneral && !showAverage)}>
          Scarica dati
        </Button>
      </div>
    </div>
  );
}
