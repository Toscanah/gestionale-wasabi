import { useOrderContext } from "@/app/(site)/context/OrderContext";
import OrderEngagementDialog from "@/app/(site)/(domains)/engagement/broadcasting/components/OrderEngagementDialog";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { patchOrderEngagements } from "@/app/(site)/lib/services/order-management/patchOrderEngagements";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Engagement() {
  const { order, updateOrder } = useOrderContext();
  const [open, setOpen] = useState(false);

  const MarketingTrigger = (
    <Button className="h-12 text-xl w-full" variant={"outline"}>
      Marketing
    </Button>
  );

  useEffect(() => {
    if (open) {
      fetchRequest<AnyOrder>("GET", "/api/orders", "getOrderById", { orderId: order.id }).then(
        (fetchedOrder) =>
          updateOrder({
            ...patchOrderEngagements({
              order,
              replaceEngagements: fetchedOrder.engagements, // overwrite everything
            }),
          })
      );
    }
  }, [open]);

  return (
    <OrderEngagementDialog
      open={open}
      setOpen={setOpen}
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
