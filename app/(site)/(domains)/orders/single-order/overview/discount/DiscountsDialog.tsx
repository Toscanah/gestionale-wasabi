"use client";

import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { OrderByType } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import ManualDiscountTab from "./ManualDiscountTab";
import PromotionsDiscountsTab from "./promotions/PromotionsDiscountsTab";
import { Badge } from "@/components/ui/badge";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import { useOrderContext } from "../../../../../context/OrderContext";

interface OrderPromotionDialogProps {
  order: OrderByType;
}

export const DiscountsSummary = ({ liveOrder }: { liveOrder: OrderByType }) => {
  const cappedDiscount = Math.min(Math.max(liveOrder.discount, 0), 100);
  const activePromos = liveOrder.promotion_usages ?? [];

  const finalTotal = useMemo(
    () =>
      getOrderTotal({
        order: { ...liveOrder, discount: cappedDiscount },
        applyDiscounts: true,
      }),
    [liveOrder, cappedDiscount]
  );

  return (
    <div className="text-lg flex">
      <span>Totale in diretta con sconto e promozioni</span>
      <span className="font-mono ml-auto font-semibold">{toEuro(finalTotal)}</span>
    </div>
  );
};

export type DiscountTabs = "manual-discount" | "promotions-discounts";

export default function DiscountsDialog() {
  const [activeTab, setActiveTab] = useState<"manual-discount" | "promotions-discounts">(
    "manual-discount"
  );

  const { order } = useOrderContext();

  return (
    <WasabiDialog
      onOpenChange={() => setActiveTab("manual-discount")}
      trigger={
        <Button className="h-12 flex-1 text-xl" variant={"outline"}>
          SCONTI
        </Button>
      }
      title="Sconti & Promozioni"
      putSeparator
      putUpperBorder
    >
      <Tabs
        defaultValue="manual-discount"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="manual-discount">
            Sconto manuale <Badge>{order.discount}%</Badge>
          </TabsTrigger>
          <TabsTrigger value="promotions-discounts">
            Promozioni <Badge>{order.promotion_usages.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <ManualDiscountTab activeTab={activeTab} />

        <PromotionsDiscountsTab activeTab={activeTab} />
      </Tabs>
    </WasabiDialog>
  );
}
