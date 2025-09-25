import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import OrderHistory from "@/app/(site)/components/order-history/OrderHistory";
import { HomeOrder, OrderGuards, PickupOrder } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { trpc } from "@/lib/server/client";

export default function OldOrders() {
  const { order, addProducts } = useOrderContext();

  // ---- Extract customerId (or undefined if not applicable)
  const customerId = OrderGuards.isPickup(order)
    ? order.pickup_order?.customer_id
    : OrderGuards.isHome(order)
      ? order.home_order?.customer_id
      : undefined;

  // ---- Query for customer
  const { data: customer } = trpc.customers.getWithDetails.useQuery(
    { customerId: customerId! },
    {
      enabled: !!customerId && !OrderGuards.isTable(order),
      staleTime: Infinity,
      select: (customer) => {
        if (!customer) return undefined;

        if (OrderGuards.isHome(order)) {
          return {
            ...customer,
            home_orders: customer.home_orders.filter((h) => h.id !== order.id),
          };
        }

        if (OrderGuards.isPickup(order)) {
          return {
            ...customer,
            pickup_orders: customer.pickup_orders.filter((p) => p.id !== order.id),
          };
        }

        return customer;
      },
    }
  );

  // ---- Guard clauses
  if (!customer) return null;

  const hasOrders = customer.home_orders.length > 0 || customer.pickup_orders.length > 0;
  if (!hasOrders) return null;

  return (
    <WasabiDialog
      size="mediumPlus"
      putUpperBorder
      title="Storico cliente"
      trigger={
        <Button type="button" variant={"outline"} className="h-12 text-xl">
          Ordini precedenti 购买记录
        </Button>
      }
    >
      <OrderHistory customer={customer} onCreate={addProducts} />
    </WasabiDialog>
  );
}
