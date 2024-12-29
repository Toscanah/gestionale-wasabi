"use client";

import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import { Cell } from "@tanstack/react-table";
import { AnyOrder } from "@/app/(site)/models";
import Order from "./single-order/Order";
import getTable from "../functions/util/getTable";
import Table from "../components/table/Table";

interface OrdersTableProps {
  data: AnyOrder[];
  type: OrderType;
}

interface CustomCellProps {
  cell: Cell<AnyOrder, unknown>;
  className: string;
}
export default function OrdersTable({ data, type }: OrdersTableProps) {
  const columns = getColumns(type);
  const table = getTable<any>({ data, columns });

  const CustomCell = ({ cell, className }: CustomCellProps) => (
    <Order cell={cell} className={className} />
  );

  return (
    <div className="w-full h-full">
      <Table
        table={table}
        tableClassName="max-h-[100%] h-[100%] rounded-none"
        rowClassName={"hover:cursor-pointer w-full h-16 max-h-16 text-xl "}
        cellClassName={(index) => (index == 3 && type == OrderType.HOME ? "max-w-42 truncate" : "")}
        CustomCell={CustomCell}
      />
    </div>
  );
}
