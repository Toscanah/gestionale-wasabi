import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithMarketing } from "../../models";
import TableColumn from "../../components/table/TableColumn";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";
import PrevMarketings from "./PrevMarketings";

export default function columns(isRightTable: boolean): ColumnDef<CustomerWithMarketing>[] {
  const columns: ColumnDef<CustomerWithMarketing>[] = [
    TableColumn({
      accessorKey: "who",
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
      accessorKey: "phone",
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
      accessorKey: "addresses",
      header: "Indirizzi",
      cellContent: (row) => joinItemsWithComma(row.original, "addresses"),
      sortable: false,
    }),
  ];

  if (isRightTable) {
    columns.push(
      TableColumn({
        accessorKey: "marketing",
        header: "Conteggio",
        cellContent: (row) => row.original.marketings.length,
        sortable: false,
      }),

      TableColumn({
        accessorKey: "marketing",
        header: "Vecchie azioni",
        cellContent: (row) => <PrevMarketings marketings={row.original.marketings} />,
        sortable: false,
      })
    );
  }

  return columns;
}
