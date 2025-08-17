import { ColumnDef } from "@tanstack/react-table";
import { AnyOrder, HomeOrder, OrderWithPayments } from "@/app/(site)/lib/shared";
import { Badge } from "@/components/ui/badge";
import { OrderType, PlannedPayment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import fetchRequest from "../../../lib/api/fetchRequest";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";
import { ActionColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";

const columns: ColumnDef<OrderWithPayments>[] = [
  ValueColumn({
    header: "Tipo di ordine",
    value: (row) => {
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
    accessor: (order) => order.type,
  }),

  ValueColumn({
    header: "Chi",
    value: (row) => {
      const order = row.original;

      return (
        (order.type === OrderType.TABLE
          ? order.table_order?.table
          : order.type === OrderType.PICKUP
          ? order.pickup_order?.name
          : order.home_order?.address.doorbell) || ""
      ).toLocaleUpperCase();
    },
    accessor: (order) => order.type,
  }),

  ValueColumn({
    header: "Quando",
    value: (row) => {
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
    accessor: (order) => order.created_at,
  }),

  ValueColumn({
    header: "Totale contanti",
    value: (row) => roundToTwo(row.original.totalCash),
    accessor: (order) => order.totalCash,
  }),

  ValueColumn({
    header: "Totale carta",
    value: (row) => roundToTwo(row.original.totalCard),
    accessor: (order) => order.totalCard,
  }),

  ValueColumn({
    header: "Totale buoni",
    value: (row) => roundToTwo(row.original.totalVouch),
    accessor: (order) => order.totalVouch,
  }),

  ValueColumn({
    header: "Totale ordine",
    value: (row) => getOrderTotal({ order: row.original, applyDiscount: true, round: true }),
    accessor: (order) => getOrderTotal({ order, applyDiscount: true, round: true }),
  }),

  ActionColumn({
    header: "Ristampa",
    action: (row) => <ReprintCell orderId={row.original.id} />,
  }),

  // TableColumn({
  //   accessorKey: "ordine",
  //   header: "Ordine",
  //   cellContent: (row) => <OrderSummary order={row.original} />,
  // }),
];

export default columns;

function ReprintCell({ orderId }: { orderId: number }) {
  const { printOrder } = usePrinter();

  const handleClick = async () => {
    const order = await fetchRequest<AnyOrder>("GET", "/api/orders/", "getOrderById", {
      orderId,
      variant: "allProducts",
    });

    let plannedPayment: PlannedPayment = PlannedPayment.UNKNOWN;
    if (order.type == OrderType.HOME) {
      plannedPayment = (order as HomeOrder).home_order?.planned_payment || PlannedPayment.UNKNOWN;
    }

    await printOrder({ order, plannedPayment, putInfo: true });
  };

  return <Button onClick={handleClick}>Stampa</Button>;
}
