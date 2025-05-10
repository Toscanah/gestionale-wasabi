"use client";

import { ArrowRight } from "@phosphor-icons/react";
import columns from "./columns/columns";
import WeekFilter from "./filters/WeekFilter";
import { Button } from "@/components/ui/button";
import EngagementFilter from "./filters/EngagementFilter";
import useEngagement from "../../hooks/engagement/useEngagement";
import getTable from "../../lib/util/getTable";
import Table from "../../components/table/Table";
import EngagementDialog from "./components/EngagementDialog";
import GoBack from "../../components/ui/misc/GoBack";

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
            context="admin"
            onSuccess={() => window.location.reload()} // TODO: implement smth better here -> setState that updates customers with new eng.
            customerIds={filteredRightCustomers.map((c) => c.id)}
            trigger={
              <Button
                disabled={filteredRightCustomers.length > 0 ? false : true}
                className="w-full"
              >
                Vai
              </Button>
            }
          />
        </div>
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
