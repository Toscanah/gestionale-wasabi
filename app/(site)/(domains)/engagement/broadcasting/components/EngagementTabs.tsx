import { useEffect, useState } from "react";
import { useOrderContext } from "../../../../context/OrderContext";
import {
  AnyOrder,
  EngagementWithDetails,
  HomeOrder,
  ParsedEngagementTemplate,
  PickupOrder,
} from "../../../../lib/shared";
import { OrderType } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import MarketingTemplates from "../../templates/MarketingTemplates";
import { Button } from "@/components/ui/button";
import { patchOrderEngagements } from "../../../../lib/services/order-management/patchOrderEngagements";
import { Checkbox } from "@/components/ui/checkbox";
import TemplateContentView from "../../templates/components/content/TemplateContentView";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { Trash } from "@phosphor-icons/react";
import EngagementHistory from "./history/EngagementHistory";

type OrderEngagementTabsProps = {
  order: AnyOrder;
  selectedTemplates: number[];
  onSelectTemplate: (id: number) => void;
  onCreateEngagement: () => void;
  onDeleteEngagement: (engagementId: number) => Promise<void>;
  onToggleEngagement: (engagementId: number) => Promise<void>;
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
  onDeleteEngagement,
  onToggleEngagement,
}: OrderEngagementTabsProps) {
  const { updateOrder } = useOrderContext();
  const [engagements, setEngagements] = useState<EngagementWithDetails[]>([]);

  const customerId =
    order.type == OrderType.HOME
      ? (order as HomeOrder).home_order?.customer?.id
      : (order as PickupOrder).pickup_order?.customer?.id;

  useEffect(() => {
    const all = [
      ...(order.engagements ?? []),
      ...(order.type === OrderType.HOME
        ? ((order as HomeOrder).home_order?.customer?.engagements ?? [])
        : []),
      ...(order.type === OrderType.PICKUP
        ? ((order as PickupOrder).pickup_order?.customer?.engagements ?? [])
        : []),
    ];
    setEngagements(dedupeEngagements(all));
  }, [order.engagements]);

  const handleEngagementDelete = async (engagementId: number) => {
    await onDeleteEngagement(engagementId)
      .then(() => {
        setEngagements((prev) => prev.filter((e) => e.id !== engagementId));
        updateOrder(
          patchOrderEngagements({
            order,
            removeTemplateIds: [engagementId],
          })
        );
      })
      .finally(() => toastSuccess("Marketing rimosso con successo"));
  };

  const handleEngagementToggle = async (engagementId: number, enabled: boolean) => {
    await onToggleEngagement(engagementId)
      .then(() => {
        setEngagements((prev) => prev.map((e) => (e.id === engagementId ? { ...e, enabled } : e)));
        updateOrder(
          patchOrderEngagements({
            order,
            updateEngagements: [{ id: engagementId, enabled }],
          })
        );
      })
      .finally(() =>
        toastSuccess(`Marketing ${enabled ? "attivato" : "disattivato"} con successo`)
      );
  };

  const handleTemplateDelete = (templateId: number) => {
    setEngagements((prev) => prev.filter((e) => e.template.id !== templateId));
    updateOrder(
      patchOrderEngagements({
        order,
        removeTemplateIds: engagements.filter((e) => e.template.id === templateId).map((e) => e.id),
      })
    );
  };

  const handleTemplateChange = (updatedTemplate: ParsedEngagementTemplate) =>
    updateOrder(
      patchOrderEngagements({
        order,
        updateTemplates: [updatedTemplate],
      })
    );

  return (
    <Tabs defaultValue="existing" className="space-y-4">
      <TabsList className="w-full flex justify-start space-x-2">
        <TabsTrigger value="existing" className="w-full">
          Marketing applicati
        </TabsTrigger>
        <TabsTrigger value="history" className="w-full">
          Storico utilizzi
        </TabsTrigger>
        <TabsTrigger value="templates-list" className="w-full">
          Lista modelli
        </TabsTrigger>
      </TabsList>

      <TabsContent value="existing" className="space-y-2">
        {engagements.length === 0 ? (
          <p className="text-muted-foreground w-full flex justify-center">
            Nessun marketing applicato
          </p>
        ) : (
          <Accordion type="multiple" className="flex flex-col gap-4 w-full items-center">
            {engagements.map((engagement, index) => (
              <div className="flex gap-6 w-full items-center" key={index}>
                <Checkbox
                  className="ml-6"
                  checked={engagement.enabled}
                  onCheckedChange={(checked) =>
                    handleEngagementToggle(engagement.id, Boolean(checked))
                  }
                />

                <TemplateContentView
                  index={index}
                  key={engagement.id}
                  template={engagement.template as ParsedEngagementTemplate}
                />

                <Button onClick={() => handleEngagementDelete(engagement.id)} className="mr-2">
                  <Trash size={24} />
                </Button>
              </div>
            ))}
          </Accordion>
        )}
      </TabsContent>

      <TabsContent value="templates-list" className="space-y-4">
        <MarketingTemplates
          selection
          selectedTemplateIds={selectedTemplates}
          onSelectTemplate={onSelectTemplate}
          filterFn={(template) => !engagements.some((e) => e.template.id === template.id)}
        />

        {selectedTemplates.length !== 0 && (
          <Button
            className="w-full"
            onClick={() => {
              onCreateEngagement();
              selectedTemplates.map(onSelectTemplate);
            }}
          >
            Vai
          </Button>
        )}
      </TabsContent>

      {order.type !== OrderType.TABLE && customerId && (
        <TabsContent value="history">
          <EngagementHistory customerId={customerId} orderId={order.id} />
        </TabsContent>
      )}
    </Tabs>
  );
}
