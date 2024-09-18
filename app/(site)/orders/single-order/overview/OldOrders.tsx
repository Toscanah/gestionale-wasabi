import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import OrderHistory from "@/app/(site)/components/OrderHistory";
import { CustomerWithDetails } from "@/app/(site)/types/CustomerWithDetails";
import { OrderType } from "@/app/(site)/types/OrderType";
import { AnyOrder, HomeOrder, PickupOrder } from "@/app/(site)/types/PrismaOrders";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function OldOrders({
  order,
  addProducts,
}: {
  order: AnyOrder;
  addProducts: (newProducts: ProductInOrderType[]) => void;
}) {
  const [customer, setCustomer] = useState<CustomerWithDetails | undefined>(undefined);

  useEffect(() => {
    // I tavoli non hanno un cliente => no cronologia ordini
    // I pickup order possono o meno avere un cliente => (possibile) no cronologia ordini

    if (
      order.type === OrderType.TABLE ||
      (order.type === OrderType.PICK_UP && !(order as PickupOrder).pickup_order?.customer_id)
    ) {
      return;
    }

    const customerId =
      order.type === OrderType.PICK_UP
        ? (order as PickupOrder).pickup_order?.customer_id
        : (order as HomeOrder).home_order?.customer_id;

    fetchRequest<CustomerWithDetails>("GET", "/api/customers/", "getCustomerWithDetails", {
      customerId,
    }).then((customer) => {
      if (!customer) return;

      let filteredCustomer = { ...customer };
      
      if (order.type === OrderType.TO_HOME) {
        filteredCustomer.home_orders = customer.home_orders.filter(
          (homeOrder) => homeOrder.order_id !== order.id
        );

      }
      if (order.type === OrderType.PICK_UP) {
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
        title="Storico ordini"
        trigger={
          <Button type="button" variant={"outline"} className="h-12 text-xl">
            Vedi ordini precedenti
          </Button>
        }
      >
        <OrderHistory customer={customer} onCreate={addProducts} />
      </DialogWrapper>
    )
  );
}
