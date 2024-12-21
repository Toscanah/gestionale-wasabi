import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CustomerWithDetails } from "../../models";

const columns: ColumnDef<CustomerWithDetails>[] = [
  TableColumn({
    accessorKey: "name_surname",
    header: "Chi",
    cellContent: (row) => row.original.name + " " + row.original.surname,
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    cellContent: (row) =>
      row.original.addresses
        .map((address) => address.doorbell.charAt(0).toUpperCase() + address.doorbell.slice(1))
        .join(", "),
  }),
];

export default columns;
