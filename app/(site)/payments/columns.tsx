import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@prisma/client";
import TableColumn from "../components/table/TableColumn";
import { PaymentWithOrder } from "../types/PaymentWithOrder";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<PaymentWithOrder>[] = [
  TableColumn({
    accessorKey: "amount",
    header: "Ammontare",
  }),

  TableColumn({
    accessorKey: "cosa",
    header: "Tipo",
    cellContent: (row) =>
      row.original.type == "CARD"
        ? "CARTA"
        : row.original.type == "CASH"
        ? "BANCONOTE"
        : row.original.type == "CREDIT"
        ? "CREDITO"
        : "BUONI PASTO",
  }),

  TableColumn({
    accessorKey: "quando",
    header: "Quando",
    cellContent: (row) => {
      const payment = row.original;
      const date = payment.created_at;
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("it-IT", options);
      const formattedDate = formatter.format(date);
      const [datePart, timePart] = formattedDate.split(" alle ");

      return `${datePart.charAt(0).toUpperCase() + datePart.substring(1)}, alle ${timePart}`;
    },
  }),

  TableColumn({
    accessorKey: "ordine",
    header: "Ordine",
    cellContent: (row) => {
      const order = row.original;

      return (
        <DialogWrapper
          trigger={
            <Button type="button" variant={"outline"}>
              Vedi ordine
            </Button>
          }
        >
          <div>{order.toString()}</div>
        </DialogWrapper>
      );
    },
  }),
];

export default columns;
