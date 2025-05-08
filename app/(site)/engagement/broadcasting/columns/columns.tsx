import { ColumnDef } from "@tanstack/react-table";
import PrevEngagement from "./PrevEngagement";
import { CustomerWithDetails } from "@/app/(site)/shared";
import TableColumn from "@/app/(site)/components/table/TableColumn";

export default function columns({
  isRightTable,
}: {
  isRightTable: boolean;
}): ColumnDef<CustomerWithDetails>[] {
  const columns: ColumnDef<CustomerWithDetails>[] = [
    TableColumn({
      header: "Chi",
      cellContent: (row) => {
        const name = row.original.name?.trim();
        const surname = row.original.surname?.trim();

        if (name && surname) {
          return `${name} ${surname}`;
        } else if (name) {
          return name;
        } else if (surname) {
          return surname;
        } else {
          return "";
        }
      },
      sortable: false,
    }),

    TableColumn({
      header: "Telefono",
      cellContent: (row) => row.original.phone?.phone || "",
      sortable: false,
    }),

    TableColumn({
      accessorKey: "email",
      header: "Email",
      sortable: false,
    }),

    TableColumn({
      joinOptions: { key: "addresses" },
      sortable: false,
    }),
  ];

  if (isRightTable) {
    columns.push(
      TableColumn({
        header: "Conteggio",
        cellContent: (row) => row.original.engagements.length,
        sortable: false,
      }),

      TableColumn({
        header: "Vecchie azioni",
        cellContent: (row) => <PrevEngagement engagements={row.original.engagements} />,
        sortable: false,
      })
    );
  }

  return columns;
}
