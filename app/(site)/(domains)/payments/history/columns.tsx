import { ColumnDef } from "@tanstack/react-table";
import { HomeOrder, ORDER_TYPE_COLORS, OrderWithSummedPayments } from "@/app/(site)/lib/shared";
import { Badge } from "@/components/ui/badge";
import { OrderType, PlannedPayment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";
import usePrinter from "@/app/(site)/hooks/printing/usePrinter";
import { ActionColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import { trpcClient } from "@/lib/server/client";
import { OrderGuards } from "@/app/(site)/lib/shared/types/order-guards";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import { MinusIcon } from "@phosphor-icons/react";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";
import { EmDash, EnDash, NA } from "@/app/(site)/components/ui/misc/Placeholders";
import WasabiPopover from "@/app/(site)/components/ui/wasabi/WasabiPopover";
import {
  PROMOTION_TYPES_COLORS,
  PROMOTION_TYPES_LABELS,
} from "@/app/(site)/lib/shared/constants/promotion-labels";
import { Separator } from "@/components/ui/separator";

const columns: ColumnDef<OrderWithSummedPayments>[] = [
  ValueColumn({
    header: "Tipo di ordine",
    sortable: false,
    value: (row) => {
      return (
        <Badge className={ORDER_TYPE_COLORS[row.original.type]}>
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
    sortable: false,
    value: (row) => {
      const order = row.original;

      return (
        (OrderGuards.isTable(order)
          ? "Tavolo " + order.table_order?.table
          : OrderGuards.isPickup(order)
            ? order.pickup_order?.name
            : order.home_order?.address.doorbell) || ""
      ).toLocaleUpperCase();
    },
    accessor: (order) =>
      (
        (OrderGuards.isTable(order)
          ? "Tavolo " + order.table_order?.table
          : OrderGuards.isPickup(order)
            ? order.pickup_order?.name
            : order.home_order?.address.doorbell) || ""
      ).toLocaleUpperCase(),
  }),

  ValueColumn({
    header: "Quando",
    sortable: false,
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

      return capitalizeFirstLetter(new Intl.DateTimeFormat("it-IT", options).format(date));
    },
    accessor: (order) => order.created_at,
  }),

  ValueColumn({
    header: "Sconti applicati",
    sortable: false,
    value: (row) => {
      const order = row.original;
      const hasPromotions =
        order.payments.some((p) => p.type === "PROMOTION") &&
        order.promotion_usages &&
        order.promotion_usages.length > 0;
      const hasManualDiscount = order.discount && order.discount > 0;

      // no discounts or promotions
      // if (!hasPromotions && !hasManualDiscount) return <EnDash />;

      const originalTotal = getOrderTotal({ order, applyDiscounts: false, round: true });
      const discountedTotal = getOrderTotal({ order, applyDiscounts: true, round: true });
      const manualDiscountAmount = hasManualDiscount
        ? (originalTotal * order.discount) / 100
        : null;

      const hasDiscounts = !hasPromotions && !hasManualDiscount;

      return (
        <WasabiPopover
          trigger={
            <Button variant="outline" disabled={hasDiscounts}>
              {hasDiscounts ? "Nessuno sconto" : "Dettagli"}
            </Button>
          }
        >
          <div className="flex flex-col gap-2 text-sm">
            <span>
              <strong>Totale originale:</strong> {toEuro(originalTotal)}
            </span>

            <Separator />

            {hasManualDiscount && (
              <div>
                <strong>Sconto manuale:</strong> −{order.discount}% (
                {toEuro(manualDiscountAmount || 0)})
              </div>
            )}

            {hasPromotions && (
              <>
                {order.promotion_usages.map((u, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Badge className={PROMOTION_TYPES_COLORS[u.promotion.type]}>
                      {PROMOTION_TYPES_LABELS[u.promotion.type]}
                    </Badge>
                    {u.promotion?.label ?? u.promotion?.code ?? "Promozione"}: -{toEuro(u.amount)}
                  </div>
                ))}
              </>
            )}

            <Separator />

            <div className="">
              <strong>Totale finale:</strong> {toEuro(discountedTotal)}
            </div>
          </div>
        </WasabiPopover>
      );
    },
    accessor: (order) =>
      (order.discount ?? 0) > 0 || order.payments.some((p) => p.type === "PROMOTION"),
  }),

  ValueColumn({
    header: "Totale contanti",
    sortable: false,
    value: (row) => {
      const order = row.original;
      const total = getOrderTotal({ order, applyDiscounts: true, round: true });
      const isPromoPaid = total === 0 && order.payments.every((p) => p.type === "PROMOTION");

      return isPromoPaid ? <NA /> : toEuro(order.summedCash);
    },
    accessor: (order) => order.summedCash,
  }),

  ValueColumn({
    header: "Totale carta",
    sortable: false,
    value: (row) => {
      const order = row.original;
      const total = getOrderTotal({ order, applyDiscounts: true, round: true });
      const isPromoPaid = total === 0 && order.payments.every((p) => p.type === "PROMOTION");

      return isPromoPaid ? <NA /> : toEuro(order.summedCard);
    },
    accessor: (order) => order.summedCard,
  }),

  ValueColumn({
    header: "Totale buoni",
    sortable: false,
    value: (row) => {
      const order = row.original;
      const total = getOrderTotal({ order, applyDiscounts: true, round: true });
      const isPromoPaid = total === 0 && order.payments.every((p) => p.type === "PROMOTION");

      return isPromoPaid ? <NA /> : toEuro(order.summedVouch);
    },
    accessor: (order) => order.summedVouch,
  }),

  ValueColumn({
    header: "Totale ordine",
    sortable: false,
    value: (row) => {
      const total = getOrderTotal({ order: row.original, applyDiscounts: true, round: true });

      const isPromoPaid =
        row.original.payments.length === 1 &&
        row.original.payments[0].type === "PROMOTION" &&
        row.original.payments[0].amount === 0;

      return (
        <div className="flex items-center gap-2">
          {/* {isPromoPaid && <Badge variant="secondary">Promo</Badge>} */}
          {toEuro(total)}
        </div>
      );
    },
    accessor: (order) => getOrderTotal({ order, applyDiscounts: true, round: true }),
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

  return (
    <Button className="w-full" variant={"outline"} onClick={handleClick}>
      Stampa
    </Button>
  );
}
