import React from "react";
import { OrderStatsResults } from "../../../../hooks/statistics/useOrdersStats";
import roundToTwo from "../../../../lib/utils/global/number/roundToTwo";
import useTable from "@/app/(site)/hooks/table/useTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { Button } from "@/components/ui/button";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";
import useCsvExport from "@/app/(site)/hooks/useCsvExport";
import { OrderFilters } from "@/app/(site)/hooks/statistics/sectionReducer";
import formatDateFilter from "@/app/(site)/lib/utils/global/date/formatDateFilter";
import { SHIFT_LABELS, ShiftFilterValue } from "@/app/(site)/lib/shared";
import { Weekday, WEEKDAY_LABELS } from "@/app/(site)/components/ui/filters/select/WeekdaysFilter";

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
};

// helper
function pct(part: number, total: number) {
  return total > 0 ? `${roundToTwo((part / total) * 100)}%` : "0%";
}

export default function SectionResults({ results, isLoading, filters }: SectionResultsProps) {
  // If no results yet → empty sections (so skeleton table takes over)
  const sections: ResultRecord[] = React.useMemo(() => {
    if (!results) return [];

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
    } = results;

    const totalOrders = homeOrders + pickupOrders + tableOrders;
    const totalRevenue = homeRevenue + pickupRevenue + tableRevenue;
    const totalSoups = homeSoups + pickupSoups + tableSoups;
    const totalRices = homeRices + pickupRices + tableRices;
    const totalSalads = homeSalads + pickupSalads + tableSalads;
    const totalRiceMass = homeRice + pickupRice + tableRice;
    const totalProducts = homeProducts + pickupProducts + tableProducts;

    return [
      {
        title: "Tavoli",
        orders: tableOrders,
        ordersPct: pct(tableOrders, totalOrders),
        revenue: roundToTwo(tableRevenue),
        revenuePct: pct(tableRevenue, totalRevenue),
        avgPerOrder: roundToTwo(tableRevenuePerOrder),
        ordersPerDay: roundToTwo(tableOrdersPerDay),
        revenuePerDay: roundToTwo(tableRevenuePerDay),
        productsPerDay: roundToTwo(tableProductsPerDay),
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
        avgPerOrder: roundToTwo(pickupRevenuePerOrder),
        ordersPerDay: roundToTwo(pickupOrdersPerDay),
        revenuePerDay: roundToTwo(pickupRevenuePerDay),
        productsPerDay: roundToTwo(pickupProductsPerDay),
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
        avgPerOrder: roundToTwo(homeRevenuePerOrder),
        ordersPerDay: roundToTwo(homeOrdersPerDay),
        revenuePerDay: roundToTwo(homeRevenuePerDay),
        productsPerDay: roundToTwo(homeProductsPerDay),
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
        avgPerOrder: roundToTwo(totalOrders > 0 ? totalRevenue / totalOrders : 0),
        ordersPerDay: roundToTwo(homeOrdersPerDay + pickupOrdersPerDay + tableOrdersPerDay),
        revenuePerDay: roundToTwo(homeRevenuePerDay + pickupRevenuePerDay + tableRevenuePerDay),
        productsPerDay: roundToTwo(homeProductsPerDay + pickupProductsPerDay + tableProductsPerDay),
        products: totalProducts,
        soups: totalSoups,
        rices: totalRices,
        salads: totalSalads,
        riceMass: formatRice(totalRiceMass),
      },
    ];
  }, [results]);

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

  const { downloadCsv } = useCsvExport(sections, CSV_HEADERS, parsedFilters);

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: sections,
    columns: columns(),
    pageSize: sections.length || 4,
  });

  const table = useTable({ data: tableData, columns: tableColumns });

  return (
    <div className="flex flex-col gap-4 w-full">
      <Table table={table} cellClassName={() => "h-20 max-h-20"} fixedColumnIndex={0} />
      <Button
        onClick={() => downloadCsv("statistiche_ordini.csv")}
        className="ml-auto"
        disabled={isLoading || sections.length === 0}
      >
        Scarica dati
      </Button>
    </div>
  );
}
