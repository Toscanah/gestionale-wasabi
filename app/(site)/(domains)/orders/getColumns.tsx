import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { OrderType } from "@prisma/client";
import { OrderByType, TableOrder, HomeOrder, PickupOrder } from "@/app/(site)/lib/shared";
import { ActionColumn, FieldColumn, ValueColumn } from "../../components/table/TableColumns";
import roundToTwo from "../../lib/utils/global/number/roundToTwo";
import { useWasabiContext } from "../../context/WasabiContext";
import { Checkbox } from "@/components/ui/checkbox";
import { OrdersTableProps } from "./OrdersTable";
import { getOrderTotal } from "../../lib/services/order-management/getOrderTotal";
import MetaLogs from "../meta/MetaLogs";
import formatWhenLabel from "../../lib/utils/domains/order/formatWhenLabel";

export default function getColumns(type: OrderType, useWhatsapp: boolean): ColumnDef<OrderByType>[] {
  const columns: ColumnDef<OrderByType>[] = [
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
    FieldColumn<OrderByType>({
      key: "selection",
      header: "",
      sortable: false,
    }),

    ValueColumn<OrderByType>({
      header: "Ora",
      value: (row) => format(new Date(row.original.created_at), "HH:mm", { locale: it }),
      accessor: (order) => order.created_at,
    }),

    ValueColumn<OrderByType>({
      header:
        type === OrderType.TABLE ? "Tavolo" : type === OrderType.PICKUP ? "Cliente" : "Campanello",
      value: (row) => {
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
            const homeOrder = row.original as HomeOrder;
            return (homeOrder.home_order?.address?.doorbell || "").toLocaleUpperCase();
          }
        }
      },
      accessor: (order) => {
        switch (type) {
          case OrderType.TABLE:
            return (order as TableOrder).table_order?.table;
          case OrderType.PICKUP:
            return (
              (order as PickupOrder).pickup_order?.customer?.surname ||
              (order as PickupOrder).pickup_order?.name ||
              ""
            );
          case OrderType.HOME:
            return (order as HomeOrder).home_order?.address?.doorbell || "";
        }
      },
    }),
  ];

  switch (type) {
    case OrderType.HOME:
      columns.push(
        FieldColumn({
          key: "home_order.customer.phone.phone",
          header: "Telefono",
        }),

        ValueColumn({
          header: "Indirizzo",
          value: (row) => {
            const homeOrder = row.original as HomeOrder;

            return (
              <div className="w-52 max-w-52">{`${(
                homeOrder.home_order?.address?.street ?? ""
              ).toUpperCase()} ${(homeOrder.home_order?.address?.civic ?? "").toUpperCase()}`}</div>
            );
          },

          accessor: (order) => {
            const homeOrder = order as HomeOrder;

            return (
              homeOrder.home_order?.address?.street?.toUpperCase() +
              " " +
              homeOrder.home_order?.address?.civic?.toUpperCase()
            );
          },
        }),

        ValueColumn({
          header: "Quando",
          value: (row) => formatWhenLabel((row.original as HomeOrder).home_order?.when),
          accessor: (order) => {
            return (order as HomeOrder).home_order?.when;
          },
        })
      );
      break;
    case OrderType.PICKUP:
      columns.push(
        ValueColumn({
          header: "Quando",
          value: (row) => formatWhenLabel((row.original as PickupOrder).pickup_order?.when),
          accessor: (order) => {
            return (order as PickupOrder).pickup_order?.when;
          },
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
    ValueColumn<OrderByType>({
      header: "Totale",
      value: (row) =>
        `€ ${roundToTwo(getOrderTotal({ order: row.original, applyDiscount: true }))}`,
      accessor: (order) => `€ ${roundToTwo(getOrderTotal({ order, applyDiscount: true }))}`,
    })
  );

  if (type === OrderType.HOME && useWhatsapp) {
    columns.push(
      ActionColumn({
        header: "Messaggi",
        action: (row) => <MetaLogs order={row.original} />,
      })
    );
  }

  return columns;
}
