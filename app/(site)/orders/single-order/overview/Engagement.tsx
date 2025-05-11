import { useOrderContext } from "@/app/(site)/context/OrderContext";
import EngagementDialog from "@/app/(site)/engagement/broadcasting/components/EngagementDialog";
import { patchOrderEngagements } from "@/app/(site)/lib/order-management/patchOrderEngagements";
import { Button } from "@/components/ui/button";

export default function Engagement() {
  const { order, updateOrder } = useOrderContext();

  const MarketingTrigger = (
    <Button className="h-12 text-xl w-full" variant={"outline"}>
      Marketing
    </Button>
  );

  return (
    <EngagementDialog
      trigger={MarketingTrigger}
      order={order}
      context="order"
      onSuccess={(newEngagements) =>
        updateOrder(
          patchOrderEngagements({
            order,
            add: newEngagements,
          })
        )
      }
    />
  );
}
