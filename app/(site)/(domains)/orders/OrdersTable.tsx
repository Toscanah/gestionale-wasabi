"use client";

import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import { Cell } from "@tanstack/react-table";
import { OrderByType } from "@/app/(site)/lib/shared";
import Order from "./single-order/Order";
import useTable from "../../hooks/table/useTable";
import Table from "../../components/table/Table";
import { cn } from "@/lib/utils";
import { useWasabiContext } from "../../context/WasabiContext";
import useSkeletonTable from "../../hooks/table/useSkeletonTable";

export interface OrdersTableProps {
  data: OrderByType[];
  type: OrderType;
  overdrawnOrderIds: Set<number>;
  isLoading: boolean;
}

interface CustomCellProps {
  cell: Cell<OrderByType, unknown>;
  className: string;
}

export default function OrdersTable({
  data,
  type,
  overdrawnOrderIds,
  isLoading,
}: OrdersTableProps) {
  const { settings } = useWasabiContext();

  const columns = getColumns(type, settings.whatsapp.active);
  const { tableColumns, tableData } = useSkeletonTable({
    data,
    columns,
    isLoading,
    pageSize: data.length,
  });
  const table = useTable<OrderByType>({
    data: tableData,
    columns: tableColumns.slice(isLoading ? 1 : 0),
  });

  const CustomCell = ({ cell, className }: CustomCellProps) => {
    const orderId = cell.row.original.id;
    const isOverdrawn = overdrawnOrderIds.has(orderId);

    return <Order cell={cell} className={className} isOverdrawn={isOverdrawn} />;
  };

  return (
    <div className="w-full h-full max-h-full">
      <Table
        showNoResult={false}
        table={table}
        tableClassName="max-h-[100%] h-[100%] rounded-none"
        rowClassName={(row) => {
          const isOverdrawn = overdrawnOrderIds.has(row.original.id);
          return cn(
            "hover:cursor-pointer w-full h-16 max-h-16 text-xl"
            // isOverdrawn && "!border !border-2 !border-red-500"
          );
        }}
        cellClassName={(index) => {
          if (type === OrderType.TABLE) {
            if (index == 2) {
              return "max-w-32 w-32";
            } else if (index == 4) {
              return "max-w-42 w-42";
            }
            return "";
          } else {
            return "";
          }
        }}
        CustomCell={isLoading ? undefined : CustomCell}
      />
    </div>
  );
}
