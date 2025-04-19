import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import OrderTable from "./OrderTable";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { AnyOrder } from "@shared"
;
import { FormEvent, useState } from "react";
import { OrderProvider } from "../../context/OrderContext";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useWasabiContext } from "../../context/WasabiContext";

interface OrderProps {
  cell: Cell<AnyOrder, unknown>;
  className: string;
}

export default function Order({ cell, className }: OrderProps) {
  const { selectedOrders, toggleOrderSelection } = useWasabiContext();
  const [open, setOpen] = useState<boolean>(false);

  const handleCheckboxClick = (e: FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleOrderSelection(cell.row.original.id);
  };

  return (
    <DialogWrapper
      open={open}
      double={cell.row.original.type !== "TABLE"}
      onOpenChange={setOpen}
      size="large"
      contentClassName="h-[95vh] flex"
      trigger={
        <TableCell
          key={cell.id}
          className={cn(
            className,
            cell.row.original.is_receipt_printed && "*:text-green-600 text-green-600"
          )}
        >
          {cell.column.getIndex() == 0 && (
            <Checkbox
              className="h-6 w-6"
              onClick={handleCheckboxClick}
              checked={selectedOrders.includes(cell.row.original.id)}
            />
          )}
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
