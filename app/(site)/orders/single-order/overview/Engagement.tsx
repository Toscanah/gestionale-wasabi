import { useOrderContext } from "@/app/(site)/context/OrderContext";
import EngagementDialog from "@/app/(site)/engagement/EngagementDialog";
import { Button } from "@/components/ui/button";

export default function Engagement() {
  const { order } = useOrderContext();

  const MarketingTrigger = (
    <Button className="h-12 text-xl" variant={"outline"}>
      Marketing
    </Button>
  );

  return <EngagementDialog trigger={MarketingTrigger} order={order} />;
}
