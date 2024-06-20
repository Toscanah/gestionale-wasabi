import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import { Order } from "../../Order";

export default function OrderCell({ cell }: { cell: Cell<Order, unknown> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-screen max-h-screen h-[90vh] flex space-x-10">
        <div className="h-full w-[80%] rounded-md border"></div>
        <div className="h-full w-[20%] flex flex-col justify-between items-center *:h-20 *:w-full [&_button]:text-4xl">
          <Button>Cancella ordine</Button>
          <Button>Cancella riga</Button>
          <Button>Dividi ordine</Button>
          <Button>Chiudi conto</Button>
          <Button>Conferma</Button>
          <span>Totale: 1000</span>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
