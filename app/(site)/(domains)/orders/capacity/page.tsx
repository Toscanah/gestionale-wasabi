"use client";

import { useMemo } from "react";
import Table from "@/components/table/Table";
import useTable from "@/hooks/table/useTable";
import { getColumns } from "./columns";
import useSettings from "@/hooks/useSettings";
import GoBack from "@/components/ui/shared/misc/GoBack";
import { Badge } from "@/components/ui/badge";
import useCapacityTracker from "@/hooks/order/useCapacityTracker";

export default function CapacityDashboard() {
  const { settings } = useSettings();
  const { lunchCapacityBlocks, dinnerCapacityBlocks, lunchCount, dinnerCount, lastUpdatedText } =
    useCapacityTracker();

  const columns = useMemo(
    () => getColumns(settings.operational.kitchen.maxCapacity),
    [settings.operational.kitchen.maxCapacity],
  );

  const tableLunch = useTable({
    data: lunchCapacityBlocks,
    columns,
  });

  const tableDinner = useTable({
    data: dinnerCapacityBlocks,
    columns,
  });

  return (
    <div className="h-screen w-[85vw] mx-auto flex flex-col gap-8 overflow-y-auto justify-center items-center">
      <div className="flex flex-col gap-2 self-start">
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Capacità ordini</h1>
          <span className="text-sm text-muted-foreground pb-1">
            Ultimo aggiornamento: {lastUpdatedText}
          </span>
        </div>
        {/* <h4 className="text-muted-foreground">
          Attualmente i calcoli non tengono in considerazione la capcità dei fattorini
        </h4> */}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">
              &lt; {settings.operational.kitchen.safeCapacity} ordini
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">
              {settings.operational.kitchen.safeCapacity} -{" "}
              {settings.operational.kitchen.maxCapacity} ordini
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">
              &gt; {settings.operational.kitchen.maxCapacity} ordini
            </span>
          </div>
        </div>
      </div>

      {/* <Separator /> */}

      <div className="w-full flex flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Pranzo</h2>
            <Badge variant={"outline"}>{lunchCount} ordini</Badge>
          </div>

          {/* <Separator /> */}

          <Table table={tableLunch} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Cena</h2>
            <Badge variant={"outline"}>{dinnerCount} ordini</Badge>
          </div>

          {/* <Separator /> */}

          <Table table={tableDinner} />
        </div>
      </div>

      <GoBack path="/home" />
    </div>
  );
}
