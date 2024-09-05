import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { OrderType } from "../types/OrderType";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder } from "../types/PrismaOrders";
import TableColumn from "../components/table/TableColumn";

export default function getColumns(type: OrderType): ColumnDef<any>[] {
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

    TableColumn<AnyOrder>({
      accessorKey: "created_at",
      header: "Ora",
      cellContent: (row) => format(new Date(row.original.created_at), "HH:mm", { locale: it }),
    }),

    TableColumn<AnyOrder>({
      accessorKey: "who",
      header:
        type === OrderType.TABLE ? "Tavolo" : type === OrderType.PICK_UP ? "Cliente" : "Campanello",
      cellContent: (row) => {
        switch (type) {
          case OrderType.TABLE: {
            const parsedRow = row.original as TableOrder;

            return parsedRow.table_order?.table?.number;
          }
          case OrderType.PICK_UP: {
            const parsedRow = row.original as PickupOrder;

            if (parsedRow.pickup_order?.customer?.surname !== "") {
              return parsedRow.pickup_order?.customer?.surname;
            } else {
              return parsedRow.pickup_order.name;
            }
          }
          case OrderType.TO_HOME: {
            const parsedRow = row.original as HomeOrder;
            return parsedRow.home_order?.address.doorbell;
          }
        }
      },
    }),
  ];

  switch (type) {
    case OrderType.TO_HOME:
      columns.push(
        TableColumn<HomeOrder>({
          accessorKey: "address.street",
          header: "Indirizzo",
          cellContent: (row) =>
            `${(row.original.home_order?.address?.street ?? "").toUpperCase()} ${(
              row.original.home_order?.address?.civic ?? ""
            ).toUpperCase()}`,
        }),
        TableColumn<HomeOrder>({
          accessorKey: "home_order.when",
          header: "Quando",
          cellContent: (row) =>
            row.original.home_order?.when == "immediate" ? "Subito" : row.original.home_order?.when,
        })
      );
      break;
    case OrderType.PICK_UP:
      columns.push(
        TableColumn<PickupOrder>({
          accessorKey: "pickup_order.when",
          header: "Quando",
        })
      );
      break;

    case OrderType.TABLE:
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
    TableColumn<AnyOrder>({
      accessorKey: "total",
      header: "Totale",
      cellContent: (row) => `€ ${row.original.total}`,
    })
  );

  return columns;
}
