import { ColumnDef } from "@tanstack/react-table";
import { HomeOrder, OrderWithSummedPayments } from "@/app/(site)/lib/shared";
import { Badge } from "@/components/ui/badge";
import { OrderType, PlannedPayment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";
import { ActionColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import { trpcClient } from "@/lib/server/client";
import { OrderGuards } from "@/app/(site)/lib/shared/types/order-guards";

const columns: ColumnDef<OrderWithSummedPayments>[] = [
  ValueColumn({
    header: "Tipo di ordine",
    value: (row) => {
      return (
        <Badge>
          {OrderGuards.isHome(row.original)
            ? "Domicilio"
            : OrderGuards.isPickup(row.original)
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
        (OrderGuards.isTable(order)
          ? order.table_order?.table
          : OrderGuards.isPickup(order)
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
    value: (row) => roundToTwo(row.original.summedCash),
    accessor: (order) => order.summedCash,
  }),

  ValueColumn({
    header: "Totale carta",
    value: (row) => roundToTwo(row.original.summedCard),
    accessor: (order) => order.summedCard,
  }),

  ValueColumn({
    header: "Totale buoni",
    value: (row) => roundToTwo(row.original.summedVouch),
    accessor: (order) => order.summedVouch,
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
];

export default columns;

function ReprintCell({ orderId }: { orderId: number }) {
  const { printOrder } = usePrinter();

  const handleClick = async () => {
    const order = await trpcClient.orders.getById.query({ orderId, variant: "allProducts" });

    let plannedPayment: PlannedPayment = PlannedPayment.UNKNOWN;
    if (OrderGuards.isHome(order)) {
      plannedPayment = order.home_order.planned_payment || PlannedPayment.UNKNOWN;
    }

    await printOrder({ order, plannedPayment, putInfo: true, forceCut: true });
  };

  return <Button onClick={handleClick}>Stampa</Button>;
}
