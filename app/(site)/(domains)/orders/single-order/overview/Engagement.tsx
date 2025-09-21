import { useOrderContext } from "@/app/(site)/context/OrderContext";
import OrderEngagementDialog from "@/app/(site)/(domains)/engagement/broadcasting/components/OrderEngagementDialog";
import { patchOrderEngagements } from "@/app/(site)/lib/services/order-management/patchOrderEngagements";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/server/client";

export default function Engagement() {
  const { order, updateOrder } = useOrderContext();
  const [open, setOpen] = useState(false);

  const MarketingTrigger = (
    <Button className="h-12 text-xl w-full" variant={"outline"}>
      Marketing
    </Button>
  );

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
