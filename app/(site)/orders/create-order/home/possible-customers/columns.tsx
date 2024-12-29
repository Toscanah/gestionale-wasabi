import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails } from "@/app/(site)/models";
import TableColumn from "@/app/(site)/components/table/TableColumn";
import joinItemsWithComma from "@/app/(site)/functions/formatting-parsing/joinItemsWithComma";

const columns = (): ColumnDef<CustomerWithDetails>[] => [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Num. di telefono",
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    cellContent: (row) => joinItemsWithComma(row.original, "doorbells"),
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Indirizzi",
    cellContent: (row) => (
      <div className="max-w-64">{joinItemsWithComma(row.original, "addresses")}</div>
    ),
  }),

  // TableColumn({
  //   accessorKey: "name",
  //   header: "Nome",
  // }),

  // TableColumn({
  //   accessorKey: "surname",
  //   header: "Cognome",
  // }),

  // TableColumn({
  //   accessorKey: "email",
  //   header: "Email",
  // }),

  TableColumn({
    accessorKey: "preferences",
    header: "Preferenze",
  }),
];

export default columns;
