import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import OrderTable from "./OrderTable";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { AnyOrder } from "../../types/PrismaOrders";
import { useState } from "react";

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
        <TableCell key={cell.id} className={className}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      }
    >
      <OrderTable order={cell.row.original} setOpen={setOpen} />
    </DialogWrapper>
  );
}
