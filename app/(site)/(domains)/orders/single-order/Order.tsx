import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import OrderTable from "./OrderTable";
import WasabiDialog from "../../../components/ui/wasabi/WasabiDialog";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { FormEvent, useState } from "react";
import { OrderProvider } from "../../../context/OrderContext";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useWasabiContext } from "../../../context/WasabiContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Warning } from "@phosphor-icons/react";
import { OrderType } from "@prisma/client";

interface OrderProps {
  cell: Cell<AnyOrder, unknown>;
  className: string;
  isOverdrawn: boolean;
}

export default function Order({ cell, className, isOverdrawn }: OrderProps) {
  const { selectedOrders, toggleOrderSelection } = useWasabiContext();
  const [open, setOpen] = useState<boolean>(false);

  const order = cell.row.original;

  const handleCheckboxClick = (e: FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleOrderSelection({ id: order.id, type: order.type });
  };

  return (
    <WasabiDialog
      open={open}
      double={cell.row.original.type !== OrderType.TABLE}
      onOpenChange={setOpen}
      size="large"
      contentClassName={cn("h-[95vh] flex", isOverdrawn && "!border !border-2 !border-red-500")}
      trigger={
        <TableCell
          key={cell.id}
          className={cn(
            className,
            cell.row.original.is_receipt_printed && "*:text-green-600 text-green-600"
          )}
        >
          {cell.column.getIndex() == 0 && (
            <div className="flex gap-4 items-center">
              {isOverdrawn && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Warning size={24} color="red" className="animate-pulse" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Per finalizzare questo ordine è necessario cucinare più riso
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Checkbox
                className="h-6 w-6"
                onClick={handleCheckboxClick}
                checked={selectedOrders.some((o) => o.id === order.id && o.type === order.type)}
              />
            </div>
          )}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      }
    >
      <OrderProvider order={cell.row.original} dialogOpen={open} setDialogOpen={setOpen}>
        <OrderTable />
      </OrderProvider>
    </WasabiDialog>
  );
}
