import { ColumnDef} from "@tanstack/react-table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { TypesOfOrder } from "../types/TypesOfOrder";
import {
  AnyOrder,
  TableOrder,
  HomeOrder,
  PickupOrder,
  BaseOrder,
} from "../types/OrderType";
import TableColumn from "../components/TableColumn";

export default function getColumns(type: TypesOfOrder): ColumnDef<any>[] {
  const columns: ColumnDef<any>[] = [
    /*createColumn({
      accessorKey: "#",
      cellContent: (row, table) => {
        if (table) {
          const index =
            table
              .getSortedRowModel()
              ?.flatRows?.findIndex(
                (flatRow) => flatRow.id === String(row.id)
              ) || 0;
          return index + 2;
        } else {
          return "";
        }
      },
    }),*/

    TableColumn<BaseOrder>({
      accessorKey: "created_at",
      headerLabel: "Ora",
      cellContent: (row) =>
        format(new Date(row.original.created_at), "HH:mm", { locale: it }),
    }),

    TableColumn<AnyOrder>({
      accessorKey: "who",
      headerLabel: type === TypesOfOrder.TABLE ? "Tavolo" : "Cliente",
      cellContent: (row) => {
        switch (type) {
          case TypesOfOrder.TABLE: {
            const parsedRow = row.original as TableOrder;

            return parsedRow.table_order?.table?.number;
          }
          case TypesOfOrder.PICK_UP: {
            const parsedRow = row.original as PickupOrder;

            if (parsedRow.pickup_order?.customer?.surname !== "") {
              return parsedRow.pickup_order?.customer?.surname;
            } else {
              return parsedRow.pickup_order.name;
            }
          }
          case TypesOfOrder.TO_HOME: {
            const parsedRow = row.original as HomeOrder;
            return parsedRow.home_order?.customer.surname;
          }
        }
      },
    }),
  ];

  switch (type) {
    case TypesOfOrder.TO_HOME:
      columns.push(
        TableColumn<HomeOrder>({
          accessorKey: "address.street",
          headerLabel: "Indirizzo",
          cellContent: (row) =>
            `${row.original.home_order?.address?.street ?? ""} ${
              row.original.home_order?.address?.civic ?? ""
            }`,
        })
      );
      break;
    case TypesOfOrder.PICK_UP:
      columns.push(
        TableColumn<PickupOrder>({
          accessorKey: "pickup_order.when",
          headerLabel: "Quando",
        })
      );
      break;
  }

  columns.push(
    TableColumn<BaseOrder>({
      accessorKey: "total",
      headerLabel: "Totale",
      cellContent: (row) => `€ ${row.original.total}`,
    })
  );

  return columns;
}
