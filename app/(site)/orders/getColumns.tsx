import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { TypesOfOrder } from "../types/TypesOfOrder";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder, BaseOrder } from "../types/OrderType";
import TableColumn from "../components/TableColumn";

export default function getColumns(type: TypesOfOrder): ColumnDef<any>[] {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "#",
      cell: ({ row, table }) => {
        if (table) {
          const index =
            table
              .getSortedRowModel()
              ?.flatRows?.findIndex((flatRow) => flatRow.id === String(row.id)) || 0;
          return <div className="text-muted-foreground">{index + 1}</div>;
        } else {
          return "";
        }
      },
    },

    TableColumn<BaseOrder>({
      accessorKey: "created_at",
      header: "Ora",
      cellContent: (row) => format(new Date(row.original.created_at), "HH:mm", { locale: it }),
    }),

    TableColumn<AnyOrder>({
      accessorKey: "who",
      header: type === TypesOfOrder.TABLE ? "Tavolo" : "Cliente",
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
          header: "Indirizzo",
          cellContent: (row) =>
            `${row.original.home_order?.address?.street ?? ""} ${
              row.original.home_order?.address?.civic ?? ""
            }`,
        }),
        TableColumn<HomeOrder>({
          accessorKey: "home_order.when",
          header: "Quando",
          cellContent: (row) =>
            row.original.home_order?.when == "immediate" ? "Subito" : row.original.home_order?.when,
        })
      );
      break;
    case TypesOfOrder.PICK_UP:
      columns.push(
        TableColumn<PickupOrder>({
          accessorKey: "pickup_order.when",
          header: "Quando",
        })
      );
      break;

    case TypesOfOrder.TABLE:
      columns.push(
        TableColumn<TableOrder>({
          accessorKey: "table_order.res_name",
          header: "Nome",
          cellContent: (row) =>
            row.original.table_order?.res_name ? row.original.table_order?.res_name : "",
        })
      );
      break;
  }

  columns.push(
    TableColumn<BaseOrder>({
      accessorKey: "total",
      header: "Totale",
      cellContent: (row) => `€ ${row.original.total}`,
    })
  );

  return columns;
}
