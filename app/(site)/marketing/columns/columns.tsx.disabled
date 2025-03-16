import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithMarketing } from "../../models";
import TableColumn from "../../components/table/TableColumn";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";
import PrevMarketings from "./PrevMarketings";

export default function columns(isRightTable: boolean): ColumnDef<CustomerWithMarketing>[] {
  const columns: ColumnDef<CustomerWithMarketing>[] = [
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
        cellContent: (row) => row.original.marketings.length,
        sortable: false,
      }),

      TableColumn({
        header: "Vecchie azioni",
        cellContent: (row) => <PrevMarketings marketings={row.original.marketings} />,
        sortable: false,
      })
    );
  }

  return columns;
}
