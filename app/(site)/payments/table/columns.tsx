import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { AnyOrder, OrderWithPayments } from "@/app/(site)/models";
import { Badge } from "@/components/ui/badge";
import { OrderType } from "@prisma/client";
import applyDiscount from "../../functions/order-management/applyDiscount";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import OrderSummary from "./OrderSummary";
import print from "../../printing/print";
import OrderReceipt from "../../printing/receipts/OrderReceipt";
import fetchRequest from "../../functions/api/fetchRequest";

const columns: ColumnDef<OrderWithPayments>[] = [
  TableColumn({
    accessorKey: "order.type",
    header: "Tipo di ordine",
    cellContent: (row) => {
      return (
        <Badge>
          {row.original.type == OrderType.HOME
            ? "Domicilio"
            : row.original.type == OrderType.PICKUP
            ? "Asporto"
            : "Tavolo"}
        </Badge>
      );
    },
  }),

  TableColumn({
    accessorKey: "who",
    header: "Chi",
    cellContent: (row) => {
      const order = row.original;

      return (
        (order.type === OrderType.TABLE
          ? order.table_order?.table
          : order.type === OrderType.PICKUP
          ? order.pickup_order?.name
          : order.home_order?.address.doorbell) || ""
      ).toLocaleUpperCase();
    },
  }),

  TableColumn({
    accessorKey: "quando",
    header: "Quando",
    cellContent: (row) => {
      const order = row.original;
      const date = new Date(order.created_at);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("it-IT", options);
      const formattedDate = formatter.format(date);
      const [datePart, timePart] = formattedDate.split(" alle ");

      return `${datePart.charAt(0).toUpperCase() + datePart.substring(1)}, alle ${timePart}`;
    },
  }),

  TableColumn({
    accessorKey: "totalCash",
    header: "Totale contanti",
  }),

  TableColumn({
    accessorKey: "totalCard",
    header: "Totale carta",
  }),

  TableColumn({
    accessorKey: "totalVouch",
    header: "Totale buoni",
  }),

  TableColumn({
    accessorKey: "totalCredit",
    header: "Totale credito",
  }),

  TableColumn({
    accessorKey: "order.total",
    header: "Totale ordine",
    cellContent: (row) => applyDiscount(row.original.total, row.original.discount),
  }),

  TableColumn({
    accessorKey: "print",
    header: "Ristampa",
    cellContent: (row) => (
      <Button
        onClick={async () => {
          const order = await fetchRequest<AnyOrder>("GET", "/api/orders/", "getOrderById", {
            orderId: row.original.id,
            variant: "allProducts",
          });

          await print(() => OrderReceipt<typeof order>(order, "none", false, true));
        }}
      >
        Stampa
      </Button>
    ),
  }),

  // TableColumn({
  //   accessorKey: "ordine",
  //   header: "Ordine",
  //   cellContent: (row) => <OrderSummary order={row.original} />,
  // }),
];

export default columns;
