import { useOrderContext } from "@/app/(site)/context/OrderContext";
import EngagementDialog from "@/app/(site)/engagement/EngagementDialog";
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
      onSuccess={(newEngagement) =>
        updateOrder({ engagements: [...order.engagements, newEngagement[0]] })
      }
    />
  );
}
