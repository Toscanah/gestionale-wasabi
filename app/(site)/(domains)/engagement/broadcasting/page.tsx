"use client";

import { ArrowRight } from "@phosphor-icons/react";
import columns from "./columns/columns";
import WeekFilter from "./filters/WeekFilter";
import { Button } from "@/components/ui/button";
import EngagementFilter from "./filters/EngagementFilter";
import useEngagement from "../../../hooks/engagement/useEngagement";
import getTable from "../../../lib/utils/global/getTable";
import Table from "../../../components/table/Table";
import GoBack from "../../../components/ui/misc/GoBack";
import AdminEngagementDialog from "./components/AdminEngagementDialog";
import useGlobalFilter from "../../../hooks/useGlobalFilter";
import { Input } from "@/components/ui/input";
import RandomSpinner from "@/app/(site)/components/ui/misc/RandomSpinner";

export default function EngagementPage() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();

  const {
    activeTypes,
    filteredLeftCustomers,
    filteredRightCustomers,
    weekFilter,
    onWeekFilterChange,
    onLeftTableRowClick,
    onRightTableRowClick,
    setActiveTypes,
    isLoading,
  } = useEngagement();

  const leftTable = getTable({
    data: filteredLeftCustomers,
    columns: columns({ isRightTable: false }),
    globalFilter,
    setGlobalFilter,
  });

  const rightTable = getTable({
    data: filteredRightCustomers,
    columns: columns({ isRightTable: true }),
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center p-16">
      <div className="min-w-w-[47.5%] w-[47.5%] h-full p-4 flex flex-col">
        <div className="flex w-full gap-4 items-center mb-4">
          <Input
            value={globalFilter}
            type="text"
            placeholder="Cerca..."
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <WeekFilter onWeekFilterChange={onWeekFilterChange} weekFilter={weekFilter} />
        </div>

        {isLoading ? (
          <RandomSpinner isLoading={isLoading} />
        ) : (
          <Table
            table={leftTable}
            tableClassName="max-h-[74vh] h-[74vh] "
            onRowClick={onLeftTableRowClick}
          />
        )}
      </div>

      <div className="w-[5%] h-full flex flex-col items-center justify-center">
        <ArrowRight size={80} />
      </div>

      <div className="min-w-w-[47.5%] w-[47.5%] h-full p-4 flex flex-col gap-4">
        {/* <EngagementFilter activeTypes={activeTypes} setActiveTypes={setActiveTypes} /> */}

        <Table
          cellClassName={(index) => (index == 3 ? "max-w-60 w-60 truncate" : "")}
          table={rightTable}
          tableClassName="max-h-[74vh] h-[74vh]"
          onRowClick={onRightTableRowClick}
        />

        <div className="flex gap-4 w-full items-center justify-center">
          <AdminEngagementDialog
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
