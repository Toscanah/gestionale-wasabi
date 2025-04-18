"use client";

import getTable from "../../functions/util/getTable";
import Table from "../../components/table/Table";
import columns from "./columns";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import SelectWrapper from "../../components/ui/select/SelectWrapper";
import GoBack from "../../components/ui/misc/GoBack";
import { useCustomersStats } from "../../hooks/statistics/useCustomersStats";
import { TablePagination } from "../../components/table/TablePagination";
import { DATE_PRESETS, DatePreset } from "../../enums/DatePreset";
import Calendar from "../../components/ui/calendar/Calendar";

export default function CustomersStats() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const {
    customers,
    filteredCustomers,
    dateFilter,
    selectedFilter,
    setDateFilter,
    handlePresetSelect,
    handleReset,
    applyFilter,
  } = useCustomersStats();

  const table = getTable({
    data: filteredCustomers,
    columns,
    globalFilter,
    setGlobalFilter,
    pagination: { putPagination: true, pageSize: 10 },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <TableControls
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onReset={handleReset}
        >
          <SelectWrapper
            className="h-10"
            onValueChange={(value) => applyFilter(value, customers)}
            value={selectedFilter ?? "all"}
            groups={[
              {
                items: [
                  { name: "Tutti", value: "all" },
                  { name: "Chi chiama da 1 a 2 volta alla settimana", value: "1-week" },
                  { name: "Chi chiama da 2 a 3 volte alla settimana", value: "2-week" },
                  { name: "Chi chiama da 3 a 4 volte alla settimana", value: "3-week" },
                  { name: "Chi chiama più volte alla settimana", value: "more-week" },
                  { name: "Chi chiama almeno 1 volta ogni 2 settimane", value: "1-2-weeks" },
                  { name: "Chi chiama almeno 1 volta ogni 3 settimane", value: "1-3-weeks" },
                  { name: "Chi chiama almeno 1 volta al mese", value: "1-month" },
                  { name: "Cliente con spesa maggiore", value: "highest-spending" },
                ],
              },
            ]}
          />

          <Calendar
            dateFilter={dateFilter}
            presets={DATE_PRESETS}
            mode="range"
            handlePresetSelection={(value) => handlePresetSelect(value as DatePreset)}
            handleDateFilter={setDateFilter}
          />
        </TableControls>

        <Table table={table} tableClassName="max-h-max" />

        <TablePagination
          table={table}
          totalCount={table.getFilteredRowModel().rows.length + " clienti totali"}
        />

        <GoBack path="/home" />
      </div>
    </div>
  );
}
