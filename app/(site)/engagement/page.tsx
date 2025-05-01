"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Table from "../components/table/Table";
import GoBack from "../components/ui/misc/GoBack";
import getTable from "../lib/util/getTable";
import useEngagement from "../hooks/engagement/useEngagement";
import columns from "./columns/columns";
import WeekFilter from "./filters/WeekFilter";
import EngagementDialog from "./EngagementDialog";
import { Button } from "@/components/ui/button";
import EngagementFilter from "./filters/EngagementFilter";

export default function EngagementPage() {
  const {
    activeTypes,
    filteredLeftCustomers,
    filteredRightCustomers,
    weekFilter,
    onWeekFilterChange,
    onLeftTableRowClick,
    onRightTableRowClick,
    setActiveTypes,
  } = useEngagement();

  const leftTable = getTable({
    data: filteredLeftCustomers,
    columns: columns({ isRightTable: false }),
  });

  const rightTable = getTable({
    data: filteredRightCustomers,
    columns: columns({ isRightTable: true }),
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center p-16">
      <div className="w-full h-full p-4 flex flex-col gap-4">
        <WeekFilter onWeekFilterChange={onWeekFilterChange} weekFilter={weekFilter} />

        <Table
          table={leftTable}
          tableClassName="max-h-[70vh] h-[70vh]"
          onRowClick={onLeftTableRowClick}
        />
      </div>

      <div className="h-full flex flex-col items-center justify-center">
        <ArrowRight size={80} />
      </div>

      <div className="w-full h-full p-4 flex flex-col gap-4">
        <EngagementFilter activeTypes={activeTypes} setActiveTypes={setActiveTypes} />

        <Table
          cellClassName={(index) => (index == 3 ? "max-w-60 w-60 truncate" : "")}
          table={rightTable}
          tableClassName="max-h-[70vh] h-[70vh]"
          onRowClick={onRightTableRowClick}
        />

        <div className="flex gap-4 w-full items-center justify-center">
          <EngagementDialog
            onSuccess={() => window.location.reload()}
            customerIds={filteredRightCustomers.map((c) => c.id)}
            trigger={<Button>Vai</Button>}
          />
        </div>
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
