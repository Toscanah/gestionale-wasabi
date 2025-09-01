"use client";

import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import { Cell } from "@tanstack/react-table";
import { AnyOrder } from "@/app/(site)/lib/shared";
import Order from "./single-order/Order";
import useTable from "../../hooks/table/useTable";
import Table from "../../components/table/Table";
import { cn } from "@/lib/utils";
import { useWasabiContext } from "../../context/WasabiContext";

export interface OrdersTableProps {
  data: AnyOrder[];
  type: OrderType;
  overdrawnOrderIds: Set<number>;
}

interface CustomCellProps {
  cell: Cell<AnyOrder, unknown>;
  className: string;
}

export default function OrdersTable({ data, type, overdrawnOrderIds }: OrdersTableProps) {
  const { settings } = useWasabiContext();
  const columns = getColumns(type, settings.useWhatsApp);
  const table = useTable<any>({ data, columns });

  const CustomCell = ({ cell, className }: CustomCellProps) => {
    const orderId = cell.row.original.id;
    const isOverdrawn = overdrawnOrderIds.has(orderId);

    return <Order cell={cell} className={className} isOverdrawn={isOverdrawn} />;
  };

  return (
    <div className="w-full h-full ">
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
        cellClassName={(index) => (index == 3 && type == OrderType.HOME ? "max-w-42 truncate" : "")}
        CustomCell={CustomCell}
      />
    </div>
  );
}
