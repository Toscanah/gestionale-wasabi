import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails } from "@/app/(site)/models";
import TableColumn from "@/app/(site)/components/table/TableColumn";

const columns = (): ColumnDef<CustomerWithDetails>[] => [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Num. di telefono",
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    cellContent: (row) =>
      row.original.addresses
        .map((address) => address.doorbell.charAt(0).toUpperCase() + address.doorbell.slice(1))
        .join(", "),
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Indirizzi",
    cellContent: (row) => (
      <div className="max-w-64">
        {row.original.addresses
          .map(
            (address) =>
              address.street.charAt(0).toUpperCase() + address.street.slice(1) + " " + address.civic
          )
          .join(", ")}
      </div>
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
