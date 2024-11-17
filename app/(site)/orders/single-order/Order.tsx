import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import OrderTable from "./OrderTable";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { AnyOrder } from "../../types/PrismaOrders";
import { useState } from "react";
import { OrderProvider } from "../../context/OrderContext";
import { cn } from "@/lib/utils";

export default function Order({
  cell,
  className,
}: {
  cell: Cell<AnyOrder, unknown>;
  className: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      hasHeader={false}
      contentClassName="w-[97.5vw] max-w-screen max-h-screen h-[95vh] flex"
      trigger={
        <TableCell
          key={cell.id}
          className={cn(
            className,
            // cell.row.original.products.some((product) => product.printedAmount === product.total)
            //   ? "text-green-500"
            //   : "text-red-500"
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      }
    >
      <OrderProvider order={cell.row.original} dialogOpen={open} setDialogOpen={setOpen}>
        <OrderTable />
      </OrderProvider>
    </DialogWrapper>
  );
}
