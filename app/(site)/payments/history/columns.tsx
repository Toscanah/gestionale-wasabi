import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { AnyOrder, HomeOrder, OrderWithPayments } from "@shared"
;
import { Badge } from "@/components/ui/badge";
import { OrderType, QuickPaymentOption } from "@prisma/client";
import applyDiscount from "../../lib/order-management/applyDiscount";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import OrderSummary from "./OrderSummary";
import print from "../../printing/print";
import OrderReceipt from "../../printing/receipts/OrderReceipt";
import fetchRequest from "../../lib/api/fetchRequest";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";

const columns: ColumnDef<OrderWithPayments>[] = [
  TableColumn({
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
    header: "Totale contanti",
    cellContent: (row) => roundToTwo(row.original.totalCash),
  }),

  TableColumn({
    header: "Totale carta",
    cellContent: (row) => roundToTwo(row.original.totalCard),
  }),

  TableColumn({
    header: "Totale buoni",
    cellContent: (row) => roundToTwo(row.original.totalVouch),
  }),

  // TableColumn({
  //   accessorKey: "totalCredit",
  //   header: "Totale credito",
  //   cellContent: (row) => roundToTwo(row.original.totalCredit),
  // }),

  TableColumn({
    header: "Totale ordine",
    cellContent: (row) => applyDiscount(row.original.total, row.original.discount),
  }),

  TableColumn({
    header: "Ristampa",
    cellContent: (row) => (
      <Button
        onClick={async () => {
          const order = await fetchRequest<AnyOrder>("GET", "/api/orders/", "getOrderById", {
            orderId: row.original.id,
            variant: "allProducts",
          });

          let quickPayment: QuickPaymentOption = QuickPaymentOption.UNKNOWN;

          if (order.type == OrderType.HOME) {
            const parsedOrder = order as HomeOrder;
            quickPayment = parsedOrder.home_order?.payment || QuickPaymentOption.UNKNOWN;
          }

          await print(() => OrderReceipt<typeof order>(order, quickPayment, true, true));
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
