import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import OrderHistory from "@/app/(site)/components/order-history/OrderHistory";
import { CustomerWithDetails } from "@/app/(site)/lib/shared"
;
import { OrderType } from "@prisma/client";
import { HomeOrder, PickupOrder } from "@/app/(site)/lib/shared"
;
import fetchRequest from "@/app/(site)/lib/core/fetchRequest";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useOrderContext } from "@/app/(site)/context/OrderContext";

export default function OldOrders() {
  const [customer, setCustomer] = useState<CustomerWithDetails | undefined>(undefined);
  const { order, addProducts } = useOrderContext();

  useEffect(() => {
    if (
      order.type === OrderType.TABLE ||
      (order.type === OrderType.PICKUP && !(order as PickupOrder).pickup_order?.customer_id)
    ) {
      return;
    }

    const customerId =
      order.type === OrderType.PICKUP
        ? (order as PickupOrder).pickup_order?.customer_id
        : (order as HomeOrder).home_order?.customer_id;

    if (!customerId) return;

    fetchRequest<CustomerWithDetails>("GET", "/api/customers/", "getCustomerWithDetails", {
      customerId,
    }).then((customer) => {
      if (!customer) return;

      let filteredCustomer = { ...customer };

      if (order.type === OrderType.HOME) {
        filteredCustomer.home_orders = customer.home_orders.filter(
          (homeOrder) => homeOrder.order_id !== order.id
        );
      }
      
      if (order.type === OrderType.PICKUP) {
        filteredCustomer.pickup_orders = customer.pickup_orders.filter(
          (pickupOrder) => pickupOrder.order_id !== order.id
        );
      }

      setCustomer(filteredCustomer);
    });
  }, []);

  return (
    customer && (
      <DialogWrapper
        size="medium"
        trigger={
          <Button type="button" variant={"outline"} className="h-12 text-xl">
            Vedi ordini precedenti 购买记录
          </Button>
        }
      >
        <OrderHistory customer={customer} onCreate={addProducts} />
      </DialogWrapper>
    )
  );
}
