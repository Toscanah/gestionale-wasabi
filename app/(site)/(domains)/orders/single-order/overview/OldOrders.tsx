import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import OrderHistory from "@/app/(site)/components/order-history/OrderHistory";
import { CustomerWithDetails, HomeOrder, PickupOrder } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { Button } from "@/components/ui/button";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { useQuery } from "@tanstack/react-query";

export default function OldOrders() {
  const { order, addProducts } = useOrderContext();

  // ---- Extract customerId (or undefined if not applicable)
  const customerId =
    order.type === OrderType.PICKUP
      ? (order as PickupOrder).pickup_order?.customer_id
      : order.type === OrderType.HOME
      ? (order as HomeOrder).home_order?.customer_id
      : undefined;

  // ---- Query for customer
  const { data: customer } = useQuery({
    queryKey: ["customerWithDetails", customerId, order.id],
    queryFn: async () => {
      if (!customerId) return undefined;

      const customer = await fetchRequest<CustomerWithDetails>(
        "GET",
        "/api/customers/",
        "getCustomerWithDetails",
        { customerId }
      );

      if (!customer) return undefined;

      // Filter out the current order from history
      const filtered = { ...customer };
      if (order.type === OrderType.HOME) {
        filtered.home_orders = customer.home_orders.filter((h) => h.id !== order.id);
      }
      if (order.type === OrderType.PICKUP) {
        filtered.pickup_orders = customer.pickup_orders.filter((p) => p.id !== order.id);
      }

      return filtered;
    },
    enabled: !!customerId && order.type !== OrderType.TABLE, // only fetch when relevant
    staleTime: Infinity
  });

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
