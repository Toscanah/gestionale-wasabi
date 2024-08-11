import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import OrderTable from "./OrderTable";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { AnyOrder } from "../../types/PrismaOrders";

export default function Order({
  cell,
  className,
}: {
  cell: Cell<AnyOrder, unknown>;
  className: string;
}) {
  return (
    <DialogWrapper
      header={false}
      contentClassName="w-[90vw] max-w-screen max-h-screen h-[90vh]"
      trigger={
        <TableCell key={cell.id} className={className}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      }
    >
      <OrderTable order={cell.row.original} />
    </DialogWrapper>
  );
}
