import { useEffect, useState } from "react";
import { useOrderContext } from "../../../context/OrderContext";
import {
  AnyOrder,
  EngagementWithDetails,
  HomeOrder,
  ParsedEngagementTemplate,
  PickupOrder,
} from "../../../shared";
import { OrderType } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MarketingTemplates from "../../templates/MarketingTemplates";
import { Button } from "@/components/ui/button";
import getTemplateName from "../../../lib/formatting-parsing/engagement/getTemplateName";
import { updateOrderWithTemplate } from "../../../lib/order-management/updateOrderWithTemplate";
import TemplateContent from "../../templates/components/TemplateContent";

type OrderEngagementTabsProps = {
  order: AnyOrder;
  selectedTemplates: number[];
  onSelectTemplate: (id: number) => void;
  onCreateEngagement: () => void;
  onDelete: (engagementId: number) => Promise<void>;
};

function dedupeEngagements(engagements: EngagementWithDetails[]): EngagementWithDetails[] {
  const seen = new Set<number>();
  return engagements.filter((engagement) => {
    if (seen.has(engagement.id)) return false;
    seen.add(engagement.id);
    return true;
  });
}

export function OrderEngagementTabs({
  order,
  selectedTemplates,
  onSelectTemplate,
  onCreateEngagement,
  onDelete,
}: OrderEngagementTabsProps) {
  const { updateOrder } = useOrderContext();
  const [activeEngagements, setActiveEngagements] = useState<EngagementWithDetails[]>([]);

  useEffect(() => {
    const all = [
      ...(order.engagements ?? []),
      ...(order.type === OrderType.HOME
        ? (order as HomeOrder).home_order?.customer?.engagements ?? []
        : []),
      ...(order.type === OrderType.PICKUP
        ? (order as PickupOrder).pickup_order?.customer?.engagements ?? []
        : []),
    ];
    setActiveEngagements(dedupeEngagements(all));
  }, [order]);

  const handleEngagementDelete = async (engagementId: number) => {
    await onDelete(engagementId);

    // Remove the deleted engagement from activeEngagements
    setActiveEngagements((prev) => prev.filter((e) => e.id !== engagementId));

    // Also remove it from the order context
    // const updatedOrder = {
    //   ...order,
    //   engagements: order.engagements?.filter((e) => e.id !== engagementId),
    //   home_order:
    //     order.type === OrderType.HOME
    //       ? {
    //           ...(order as HomeOrder).home_order,
    //           customer: {
    //             ...(order as HomeOrder).home_order.customer,
    //             engagements:
    //               (order as HomeOrder).home_order.customer?.engagements.filter(
    //                 (e) => e.id !== engagementId
    //               ) ?? [],
    //           },
    //         }
    //       : order.home_order,
    //   pickup_order:
    //     order.type === OrderType.PICKUP
    //       ? {
    //           ...(order as PickupOrder).pickup_order,
    //           customer: {
    //             ...(order as PickupOrder).pickup_order.customer,
    //             engagements:
    //               (order as PickupOrder).pickup_order.customer?.engagements.filter(
    //                 (e) => e.id !== engagementId
    //               ) ?? [],
    //           },
    //         }
    //       : order.pickup_order,
    // };

    // updateOrder(updatedOrder);
  };

  const handleTemplateDelete = (templateId: number) => {
    // Remove all active engagements that used this template
    const updatedEngagements = activeEngagements.filter((e) => e.template.id !== templateId);
    setActiveEngagements(updatedEngagements);

    // Remove from order context as well
    // const updatedOrder = {
    //   ...order,
    //   engagements: order.engagements?.filter((e) => e.template.id !== templateId),
    //   home_order:
    //     order.type === OrderType.HOME
    //       ? {
    //           ...(order as HomeOrder).home_order,
    //           customer: {
    //             ...(order as HomeOrder).home_order.customer,
    //             engagements:
    //               (order as HomeOrder).home_order.customer?.engagements.filter(
    //                 (e) => e.template.id !== templateId
    //               ) ?? [],
    //           },
    //         }
    //       : order.home_order,
    //   pickup_order:
    //     order.type === OrderType.PICKUP
    //       ? {
    //           ...(order as PickupOrder).pickup_order,
    //           customer: {
    //             ...(order as PickupOrder).pickup_order.customer,
    //             engagements:
    //               (order as PickupOrder).pickup_order.customer?.engagements.filter(
    //                 (e) => e.template.id !== templateId
    //               ) ?? [],
    //           },
    //         }
    //       : order.pickup_order,
    // };

    // updateOrder(updatedOrder);
  };

  return (
    <Tabs defaultValue="existing" className="space-y-4">
      <TabsList className="w-full flex justify-start space-x-2">
        <TabsTrigger value="existing" className="w-full">
          Marketing attivo
        </TabsTrigger>
        <TabsTrigger value="select" className="w-full">
          Modelli
        </TabsTrigger>
      </TabsList>

      <TabsContent value="existing" className="space-y-2">
        {activeEngagements.length === 0 ? (
          <p className="text-muted text-sm">Nessun marketing attivo</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {activeEngagements.map((engagement, index) => (
              <TemplateContent
                key={engagement.id} // ✅ added key
                mode="view"
                onDelete={async () => handleEngagementDelete(engagement.id)}
                index={index}
                template={engagement.template as ParsedEngagementTemplate}
                disabled={true}
              />
            ))}
          </Accordion>
        )}
      </TabsContent>

      <TabsContent value="select" className="space-y-4">
        <MarketingTemplates
          selection
          selectedTemplateIds={selectedTemplates}
          onSelectTemplate={onSelectTemplate}
          onTemplateChange={(updatedTemplate) =>
            updateOrder(updateOrderWithTemplate(order, updatedTemplate))
          }
          onTemplateDelete={handleTemplateDelete}
        />
        <Button
          className="w-full"
          onClick={onCreateEngagement}
          disabled={selectedTemplates.length === 0}
        >
          Vai
        </Button>
      </TabsContent>
    </Tabs>
  );
}
