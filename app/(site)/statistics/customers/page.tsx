"use client";

import getTable from "../../functions/util/getTable";
import Table from "../../components/table/Table";
import columns from "./columns";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import SelectWrapper from "../../components/select/SelectWrapper";
import GoBack from "../../components/GoBack";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { DateFilters, useCustomerStats } from "../../hooks/statistics/useCustomerStats";
import { TablePagination } from "../../components/table/TablePagination";

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
  } = useCustomerStats();

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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter?.from
                  ? dateFilter.to
                    ? `${format(dateFilter.from, "PPP", { locale: it })} - ${format(
                        dateFilter.to,
                        "PPP",
                        { locale: it }
                      )}`
                    : format(dateFilter.from, "PPP", { locale: it })
                  : "Seleziona una data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <SelectWrapper
                onValueChange={(value) => handlePresetSelect(value as DateFilters)}
                className="h-8"
                groups={[
                  {
                    items: [
                      {
                        name: "Oggi",
                        value: "today",
                      },
                      {
                        name: "Ieri",
                        value: "yesterday",
                      },
                      {
                        name: "Ultimi 7 giorni",
                        value: "last7",
                      },
                      {
                        name: "Ultimi 30 giorni",
                        value: "last30",
                      },
                      {
                        name: "Questo mese",
                        value: "thisMonth",
                      },
                      {
                        name: "Questo'anno",
                        value: "thisYear",
                      },
                    ],
                  },
                ]}
              />
              <div className="rounded-md border">
                <Calendar
                  locale={it}
                  mode="range"
                  initialFocus
                  defaultMonth={dateFilter?.from}
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  numberOfMonths={2}
                />
              </div>
            </PopoverContent>
          </Popover>
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
