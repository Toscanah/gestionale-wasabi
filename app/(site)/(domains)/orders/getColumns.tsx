import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { OrderType } from "@prisma/client";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder } from "@/app/(site)/lib/shared";
import TableColumn from "../../components/table/TableColumn";
import getDiscountedTotal from "../../lib/services/order-management/getDiscountedTotal";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import { useWasabiContext } from "../../context/WasabiContext";
import { Checkbox } from "@/components/ui/checkbox";
import { OrdersTableProps } from "./OrdersTable";
import { getOrderTotal } from "../../lib/services/order-management/getOrderTotal";
import MetaLogs from "../meta/MetaLogs";

export default function getColumns(type: OrderType, useWhatsapp: boolean): ColumnDef<any>[] {
  const columns: ColumnDef<any>[] = [
    // {
    //   accessorKey: "#",
    //   cell: ({ row, table }) => {
    //     if (table) {
    //       const index =
    //         table
    //           .getSortedRowModel()
    //           ?.flatRows?.findIndex((flatRow) => flatRow.id === String(row.id)) || 0;

    //       return (
    //         <div className="text-muted-foreground gap-2 flex items-center">
    //           <span>{index + 1}</span>
    //           {/* <span className="text-sm">{row.original.is_receipt_printed ? "✔️" : "❌"}</span> */}
    //         </div>
    //       );
    //     } else {
    //       return "";
    //     }
    //   },
    // },
    TableColumn<AnyOrder>({
      accessorKey: "selection",
      header: "",
      sortable: false,
    }),

    TableColumn<AnyOrder>({
      header: "Ora",
      cellContent: (row) => format(new Date(row.original.created_at), "HH:mm", { locale: it }),
    }),

    TableColumn<AnyOrder>({
      header:
        type === OrderType.TABLE ? "Tavolo" : type === OrderType.PICKUP ? "Cliente" : "Campanello",
      cellContent: (row) => {
        switch (type) {
          case OrderType.TABLE: {
            const parsedRow = row.original as TableOrder;
            return parsedRow.table_order?.table.toLocaleUpperCase();
          }
          case OrderType.PICKUP: {
            const parsedRow = row.original as PickupOrder;
            return (
              parsedRow.pickup_order?.customer?.surname ||
              parsedRow.pickup_order?.name ||
              ""
            ).toLocaleUpperCase();
          }

          case OrderType.HOME: {
            const parsedRow = row.original as HomeOrder;
            return (parsedRow.home_order?.address?.doorbell || "").toLocaleUpperCase();
          }
        }
      },
    }),
  ];

  switch (type) {
    case OrderType.HOME:
      columns.push(
        TableColumn<HomeOrder>({
          accessorKey: "home_order.customer.phone.phone",
          header: "Telefono",
          // cellContent:(row) => row.original.home_order?.customer?.phone?.phone ?? "",
        }),

        TableColumn<HomeOrder>({
          header: "Indirizzo",
          cellContent: (row) => (
            <div className="w-52 max-w-52">{`${(
              row.original.home_order?.address?.street ?? ""
            ).toUpperCase()} ${(
              row.original.home_order?.address?.civic ?? ""
            ).toUpperCase()}`}</div>
          ),
        }),

        TableColumn<HomeOrder>({
          header: "Quando",
          cellContent: (row) =>
            row.original.home_order?.when == "immediate" ? "Subito" : row.original.home_order?.when,
        })
      );
      break;
    case OrderType.PICKUP:
      columns.push(
        TableColumn<PickupOrder>({
          header: "Quando",
          cellContent: (row) =>
            row.original.pickup_order?.when == "immediate"
              ? "Subito"
              : row.original.pickup_order?.when,
        })
      );
      break;

    // case OrderType.TABLE:
    //   columns.push(
    //     TableColumn<TableOrder>({
    //       accessorKey: "table_order.res_name",
    //       header: "Nome",
    //       cellContent: (row) =>
    //         row.original.table_order?.res_name ? row.original.table_order?.res_name : "",
    //     })
    //   );
    //   break;
  }

  columns.push(
    TableColumn<AnyOrder>({
      header: "Totale",
      cellContent: (row) =>
        `€ ${roundToTwo(getOrderTotal({ order: row.original, applyDiscount: true }))}`,
    })
  );

  if (type === OrderType.HOME && useWhatsapp) {
    columns.push(
      TableColumn<HomeOrder>({
        header: "Messaggi",
        cellContent: (row) => <MetaLogs order={row.original} />,
      })
    );
  }

  return columns;
}
