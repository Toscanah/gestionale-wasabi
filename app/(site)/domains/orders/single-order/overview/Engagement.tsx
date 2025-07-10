import { useOrderContext } from "@/app/(site)/context/OrderContext";
import OrderEngagementDialog from "@/app/(site)/domains/engagement/broadcasting/components/OrderEngagementDialog";
import fetchRequest from "@/app/(site)/lib/core/fetchRequest";
import { patchOrderEngagements } from "@/app/(site)/lib/services/order-management/patchOrderEngagements";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Engagement() {
  const { order, updateOrder } = useOrderContext();

  const MarketingTrigger = (
    <Button className="h-12 text-xl w-full" variant={"outline"}>
      Marketing
    </Button>
  );

  // TODO: sistemare sta roba che non capisco cosa occorre aggiornare dei engagmenet / templates
  useEffect(() => {
    fetchRequest<AnyOrder>("GET", "/api/orders", "getOrderById", { orderId: order.id }).then(
      (fetchedOrder) => {
        const patched = patchOrderEngagements({
          order,
          updateEngagements: fetchedOrder.engagements,
        });

        updateOrder({ engagements: patched.engagements });
      }
    );
  }, []);

  return (
    <OrderEngagementDialog
      trigger={MarketingTrigger}
      order={order}
      onSuccess={(newEngagements) =>
        updateOrder(
          patchOrderEngagements({
            order,
            addEngagements: newEngagements,
          })
        )
      }
    />
  );
}
