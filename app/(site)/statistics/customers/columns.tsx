import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CustomerWithDetails } from "@/app/(site)/lib/shared"
;
import { format } from "date-fns"; // Ensure date-fns is installed
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import ScoreDialog from "./ScoreDialog";
import joinItemsWithComma from "../../lib/formatting-parsing/joinItemsWithComma";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import { CustomerWithStats } from "../../lib/shared/types/CustomerWithStats";
import OrderHistory from "../../components/order-history/OrderHistory";

const columns: ColumnDef<CustomerWithStats>[] = [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Telefono",
  }),

  TableColumn({
    header: "Chi",
    cellContent: (row) => {
      const { name, surname } = row.original;
      return [name, surname].filter(Boolean).join(" ") || "";
    },
  }),

  TableColumn({
    header: "Campanelli",
    joinOptions: {
      key: "doorbells",
      wrapper: ({ children }) => <div className="max-w-36">{children}</div>,
    },
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
