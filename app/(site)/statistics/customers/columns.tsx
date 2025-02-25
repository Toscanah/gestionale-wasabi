import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CustomerWithDetails } from "../../models";
import { format } from "date-fns"; // Ensure date-fns is installed
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import ScoreDialog from "./ScoreDialog";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import { CustomerWithStats } from "../../types/CustomerWithStats";
import OrderHistory from "../../components/order-history/OrderHistory";

const columns: ColumnDef<CustomerWithStats>[] = [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Telefono",
  }),

  TableColumn({
    accessorKey: "name_surname",
    header: "Chi",
    cellContent: (row) => {
      const { name, surname } = row.original;
      return [name, surname].filter(Boolean).join(" ") || "";
    },
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    accessorFn: (original) => joinItemsWithComma(original, "doorbells"),
    cellContent: (row) => (
      <div className="max-w-36">{joinItemsWithComma(row.original, "doorbells")}</div>
    ),
  }),

  TableColumn({
    accessorKey: "averageOrdersWeek",
    header: "Media a settimana",
  }),

  TableColumn({
    accessorKey: "averageOrdersMonth",
    header: "Media al mese",
  }),

  TableColumn({
    accessorKey: "averageOrdersYear",
    header: "Media all'anno",
  }),

  TableColumn({
    accessorKey: "averageSpending",
    header: "Spesa media",
  }),

  TableColumn({
    accessorKey: "lastOrder",
    header: "Ultimo ordine",
    cellContent: (row) =>
      row.original.lastOrder ? format(row.original.lastOrder, "dd-MM-yyyy") : "",
  }),

  TableColumn({
    accessorKey: "totalSpending",
    header: "Spesa totale",
  }),

  // TableColumn({
  //   accessorKey: "score",
  //   header: "Punteggio",
  // }),

  // TableColumn({
  //   accessorKey: "customer_score",
  //   header: "Punteggio",
  //   cellContent: (row) => <ScoreDialog customer={row.original} />,
  // }),

  TableColumn({
    accessorKey: "orderHistory",
    header: "Storico ordini",
    cellContent: (row) => {
      const customer = row.original;

      return (
        <DialogWrapper
          size="medium"
          title="Storico ordini"
          trigger={
            <Button type="button" variant={"outline"}>
              Vedi ordini precedenti
            </Button>
          }
        >
          <OrderHistory noStatistics customer={customer} />
        </DialogWrapper>
      );
    },
  }),
];

export default columns;
