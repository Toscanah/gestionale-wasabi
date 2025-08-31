import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import RandomSpinner from "../../../../components/ui/misc/loader/RandomSpinner";
import { OrderStatsResults } from "../../../../hooks/statistics/useOrdersStats";
import roundToTwo from "../../../../lib/utils/global/number/roundToTwo";
import useTable from "@/app/(site)/hooks/table/useTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { Button } from "@/components/ui/button";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";

interface SectionResultsProps {
  results: OrderStatsResults;
  isLoading: boolean;
}

export type ResultRecord = {
  title: string;
  orders: number;
  ordersPct: string;
  revenue: string;
  revenuePct: string;
  avg: number | string;
  products: number;
  soups: number;
  rices: number;
  salads: number;
  riceMass: number;
};

export default function SectionResults({
  results: {
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
  },
  isLoading,
}: SectionResultsProps) {
  const totalOrders = homeOrders + pickupOrders + tableOrders;
  const totalRevenue = homeRevenue + pickupRevenue + tableRevenue;
  const totalSoups = homeSoups + pickupSoups + tableSoups;
  const totalRices = homeRices + pickupRices + tableRices;
  const totalSalads = homeSalads + pickupSalads + tableSalads;
  const totalRiceMass = homeRice + pickupRice + tableRice;
  const totalProducts = homeProducts + pickupProducts + tableProducts;

  const pct = (part: number, total: number) =>
    total > 0 ? `${roundToTwo((part / total) * 100)}%` : "0%";
  const avgPerOrder = (revenue: number, orders: number) =>
    orders > 0 ? roundToTwo(revenue / orders) : 0;

  const sections: ResultRecord[] = [
    {
      title: "Tavoli",
      orders: tableOrders,
      ordersPct: pct(tableOrders, totalOrders),
      revenue: roundToTwo(tableRevenue),
      revenuePct: pct(tableRevenue, totalRevenue),
      avg: avgPerOrder(tableRevenue, tableOrders),
      products: tableProducts,
      soups: tableSoups,
      rices: tableRices,
      salads: tableSalads,
      riceMass: tableRice,
    },
    {
      title: "Asporto",
      orders: pickupOrders,
      ordersPct: pct(pickupOrders, totalOrders),
      revenue: roundToTwo(tableRevenue),
      revenuePct: pct(pickupRevenue, totalRevenue),
      avg: avgPerOrder(pickupRevenue, pickupOrders),
      products: pickupProducts,
      soups: pickupSoups,
      rices: pickupRices,
      salads: pickupSalads,
      riceMass: pickupRice,
    },
    {
      title: "Domicilio",
      orders: homeOrders,
      ordersPct: pct(homeOrders, totalOrders),
      revenue: roundToTwo(homeRevenue),
      revenuePct: pct(homeRevenue, totalRevenue),
      avg: avgPerOrder(homeRevenue, homeOrders),
      products: homeProducts,
      soups: homeSoups,
      rices: homeRices,
      salads: homeSalads,
      riceMass: homeRice,
    },
    {
      title: "Tutti",
      orders: totalOrders,
      ordersPct: "100%",
      revenue: roundToTwo(totalRevenue),
      revenuePct: "100%",
      avg: avgPerOrder(totalRevenue, totalOrders),
      products: totalProducts,
      soups: totalSoups,
      rices: totalRices,
      salads: totalSalads,
      riceMass: totalRiceMass,
    },
  ];

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: sections,
    columns: columns(),
    pageSize: sections.length, // or a fixed number of skeleton rows
  });

  const table = useTable({ data: tableData, columns: tableColumns });

  function downloadCSV(data: ResultRecord[]) {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csv = [headers, rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "statistiche_ordini.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Table table={table} cellClassName={() => "h-20 max-h-20"} />
      <Button
        onClick={() => downloadCSV(sections)}
        className="ml-auto px-3 py-1 text-sm border rounded hover:bg-muted"
      >
        (funzione IN_PROGRESS) Scarica CSV
      </Button>
    </div>
  );
}
