import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import { BaseOrder } from "../../types/OrderType";
import OrderTable from "./OrderTable";

export default function Order({
  cell,
  className,
}: {
  cell: Cell<BaseOrder, unknown>;
  className: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableCell key={cell.id} className={className}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-screen max-h-screen h-[90vh] flex space-x-10">
        <OrderTable order={cell.row.original} />
      </DialogContent>
    </Dialog>
  );
}
