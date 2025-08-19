import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import RandomSpinner from "../../../../components/ui/misc/loader/RandomSpinner";
import { Results } from "../../../../hooks/statistics/useOrdersStats";
import roundToTwo from "../../../../lib/utils/global/number/roundToTwo";
import getTable from "@/app/(site)/lib/utils/global/getTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";

interface SectionResultsProps {
  results: Results;
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
}: SectionResultsProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const table = getTable({ data: sections, columns: columns() });

  return (
    <>
      <Separator orientation="horizontal" />

      {isLoading ? (
        <RandomSpinner isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-8 w-full">
          <Table table={table} />
        </div>
      )}
    </>
  );
}
