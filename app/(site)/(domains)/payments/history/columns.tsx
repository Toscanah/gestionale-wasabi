import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../../components/table/TableColumn";
import { AnyOrder, HomeOrder, OrderWithPayments } from "@/app/(site)/lib/shared";
import { Badge } from "@/components/ui/badge";
import { OrderType, PlannedPayment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import fetchRequest from "../../../lib/api/fetchRequest";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";

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

  TableColumn({
    header: "Totale ordine",
    cellContent: (row) => getOrderTotal({ order: row.original, applyDiscount: true, round: true }),
  }),

  TableColumn({
    header: "Ristampa",
    cellContent: (row) => <ReprintCell orderId={row.original.id} />,
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
