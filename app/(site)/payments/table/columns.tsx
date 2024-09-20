import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { OrderWithPayments } from "../../types/OrderWithPayments";
import { Badge } from "@/components/ui/badge";
import { OrderType } from "../../types/OrderType";
import applyDiscount from "../../util/functions/applyDiscount";

const columns: ColumnDef<OrderWithPayments>[] = [
  TableColumn({
    accessorKey: "order.type",
    header: "Tipo di ordine",
    cellContent: (row) => {
      return (
        <Badge>
          {row.original.type == OrderType.TO_HOME
            ? "Domicilio"
            : row.original.type == OrderType.PICK_UP
            ? "Asporto"
            : "Tavolo"}
        </Badge>
      );
    },
  }),

  TableColumn({
    accessorKey: "quando",
    header: "Quando",
    cellContent: (row) => {
      const order = row.original;
      const date = order.created_at;
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
    accessorKey: "totalCash",
    header: "Totale contanti",
  }),

  TableColumn({
    accessorKey: "totalCard",
    header: "Totale carta",
  }),

  TableColumn({
    accessorKey: "totalVouch",
    header: "Totale buoni",
  }),

  TableColumn({
    accessorKey: "totalCredit",
    header: "Totale credito",
  }),

  TableColumn({
    accessorKey: "order.total",
    header: "Totale ordine",
    cellContent: (row) => applyDiscount(row.original.total, row.original.discount)
  }),

  // TableColumn({
  //   accessorKey: "ordine",
  //   header: "Ordine",
  //   cellContent: (row) => {
  //     const order = row.original;

  //     return (
  //       <DialogWrapper
  //         trigger={
  //           <Button type="button" variant={"outline"}>
  //             Vedi ordine
  //           </Button>
  //         }
  //         title={
  //           <div className="flex gap-2 items-center">
  //             <Badge>
  //               {order.type == OrderType.TO_HOME
  //                 ? "Domicilio"
  //                 : order.type == OrderType.TABLE
  //                 ? "Tavolo"
  //                 : "Asporto"}
  //             </Badge>
  //             Ordine del {new Date(order.created_at).toLocaleDateString("it-IT")}
  //           </div>
  //         }
  //       >
  //         <div className="flex flex-col gap-4">
  //           <span>Totale: € {order.total}</span>
  //         </div>
  //       </DialogWrapper>
  //     );
  //   },
  // }),
];

export default columns;
