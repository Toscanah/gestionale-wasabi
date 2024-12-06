"use client";

import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import { Cell } from "@tanstack/react-table";
import { AnyOrder } from "../types/PrismaOrders";
import Order from "./single-order/Order";
import getTable from "../util/functions/getTable";
import Table from "../components/table/Table";

interface TableProps {
  data: AnyOrder[];
  type: OrderType;
}

export default function OrdersTable({ data, type }: TableProps) {
  const columns = getColumns(type);
  const table = getTable<any>({ data, columns });

  const CustomCell = ({
    cell,
    className,
  }: {
    cell: Cell<AnyOrder, unknown>;
    className: string;
  }) => <Order cell={cell} className={className} />;

  return (
    <div className="w-full h-full">
      <Table
        table={table}
        tableClassName="max-h-[100%] h-[100%] rounded-none"
        rowClassName={"hover:cursor-pointer w-full h-16 max-h-16 text-xl "}
        cellClassName={(index: number) =>
          index == 3 && type == OrderType.TO_HOME ? "max-w-42 truncate" : ""
        }
        CustomCell={CustomCell}
      />
    </div>
  );
}
