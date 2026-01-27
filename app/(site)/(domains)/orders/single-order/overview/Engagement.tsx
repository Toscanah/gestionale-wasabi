import { useOrderContext } from "@/context/OrderContext";
import OrderEngagementDialog from "@/domains/engagement/broadcasting/components/OrderEngagementDialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import patchOrderEngagements from "@/lib/services/order-management/patchOrderEngagements";

export default function Engagement() {
  const { order, updateOrder } = useOrderContext();
  const [open, setOpen] = useState(false);

  const MarketingTrigger = (
    <Button className="h-12 text-xl flex-1 w-full " variant={"outline"}>
      MARKETING
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
