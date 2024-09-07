import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../components/table/TableColumn";
import { PaymentWithOrder } from "../types/PaymentWithOrder";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderType } from "../types/OrderType";

const columns: ColumnDef<PaymentWithOrder>[] = [
  TableColumn({
    accessorKey: "amount",
    header: "Ammontare",
    cellContent: (row) => "€ " + row.original.amount,
  }),

  TableColumn({
    accessorKey: "cosa",
    header: "Tipo",
    cellContent: (row) =>
      row.original.type == "CARD"
        ? "CARTA"
        : row.original.type == "CASH"
        ? "CONTANTI"
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
      const order = row.original.order;

      return (
        <DialogWrapper
          trigger={
            <Button type="button" variant={"outline"}>
              Vedi ordine
            </Button>
          }
          title={
            <div className="flex gap-2 items-center">
              <Badge>
                {order.type == OrderType.TO_HOME
                  ? "Domicilio"
                  : order.type == OrderType.TABLE
                  ? "Tavolo"
                  : "Asporto"}
              </Badge>
              Ordine del {new Date(order.created_at).toLocaleDateString("it-IT")}
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <span>Totale: € {order.total}</span>
          </div>
        </DialogWrapper>
      );
    },
  }),
];

export default columns;
