import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns"; // Ensure date-fns is installed
import DialogWrapper from "../../../components/ui/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";

import { CustomerWithStats } from "../../../lib/shared/types/CustomerWithStats";
import OrderHistory from "../../../components/order-history/OrderHistory";
import {
  ActionColumn,
  FieldColumn,
  JoinColumn,
  ValueColumn,
} from "@/app/(site)/components/table/tableColumns";

const columns: ColumnDef<CustomerWithStats>[] = [
  FieldColumn({
    key: "phone.phone",
    header: "Telefono",
  }),

  ValueColumn({
    header: "Chi",
    value: (row) => {
      const { name, surname } = row.original;
      return [name, surname].filter(Boolean).join(" ") || "";
    },
    accessor: (customer) => `${customer.name} ${customer.surname}`,
  }),

  JoinColumn({
    header: "Campanelli",
    options: {
      key: "doorbells",
      wrapper: ({ children }) => <div className="max-w-36">{children}</div>,
    },
  }),

  FieldColumn({
    key: "averageOrdersWeek",
    header: "Media a settimana",
  }),

  FieldColumn({
    key: "averageOrdersMonth",
    header: "Media al mese",
  }),

  FieldColumn({
    key: "averageOrdersYear",
    header: "Media all'anno",
  }),

  FieldColumn({
    key: "averageSpending",
    header: "Spesa media",
  }),

  ValueColumn({
    header: "Ultimo ordine",
    value: (row) =>
      row.original.lastOrder ? format(row.original.lastOrder, "dd-MM-yyyy") : "",
    accessor: (customer) => customer.lastOrder,
  }),

  FieldColumn({
    key: "totalSpending",
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

  ActionColumn({
    header: "Storico ordini",
    action: (row) => {
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
          <OrderHistory customer={customer} />
        </DialogWrapper>
      );
    },
  }),
];

export default columns;
