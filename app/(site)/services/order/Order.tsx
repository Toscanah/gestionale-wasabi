import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TableCell } from "@/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import { OrderType } from "../../types/OrderType";
import OrderTable from "./OrderTable";

export default function Order({ cell }: { cell: Cell<OrderType, unknown> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-screen max-h-screen h-[90vh] flex space-x-10">
        <div className="h-full w-[80%] rounded-md border">
          <OrderTable products={cell.row.original.products}/>
        </div>
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
