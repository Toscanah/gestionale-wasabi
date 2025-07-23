import TableColumn from "@/app/(site)/components/table/TableColumn";
import { RiceBatch } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

const columns = (): ColumnDef<RiceBatch>[] => [
  // TableColumn({
  //   header: "#",
  //   isRowIndex: true,
  // }),

  TableColumn<RiceBatch>({
    header: "Etichetta",
    cellContent: ({ original }) => original.label,
  }),

  // TableColumn({
  //   header: "Valore",
  //   accessorKey: "amount",
  // }),
];

export default columns;
