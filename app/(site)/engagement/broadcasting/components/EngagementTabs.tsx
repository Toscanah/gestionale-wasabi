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
import { Accordion } from "@/components/ui/accordion";
import MarketingTemplates from "../../templates/MarketingTemplates";
import { Button } from "@/components/ui/button";
import { patchOrderEngagements } from "../../../lib/order-management/patchOrderEngagements";
import TemplateContent from "../../templates/components/TemplateContent";
import { Checkbox } from "@/components/ui/checkbox";

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

    setActiveEngagements((prev) => prev.filter((e) => e.id !== engagementId));

    updateOrder(
      patchOrderEngagements({
        order,
        removeIds: [engagementId],
      })
    );
  };

  const handleTemplateDelete = (templateId: number) => {
    setActiveEngagements((prev) => prev.filter((e) => e.template.id !== templateId));

    updateOrder(
      patchOrderEngagements({
        order,
        removeIds: activeEngagements.filter((e) => e.template.id === templateId).map((e) => e.id),
      })
    );
  };

  return (
    <Tabs defaultValue="existing" className="space-y-4">
      <TabsList className="w-full flex justify-start space-x-2">
        <TabsTrigger value="existing" className="w-full">
          Marketing attivo
        </TabsTrigger>
        <TabsTrigger value="select" className="w-full">
          Modelli disponibili
        </TabsTrigger>
      </TabsList>

      <TabsContent value="existing" className="space-y-2">
        {activeEngagements.length === 0 ? (
          <p className="text-muted-foreground w-full flex justify-center">
            Nessun marketing attivo
          </p>
        ) : (
          <Accordion type="multiple" className="flex gap-4 w-full items-center">
            {activeEngagements.map((engagement, index) => (
              <>
                {/* <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleCheckboxChange(template.id)}
                /> */}
                <TemplateContent
                  key={engagement.id} // ✅ added key
                  mode="view"
                  onDelete={async () => handleEngagementDelete(engagement.id)}
                  index={index}
                  template={engagement.template as ParsedEngagementTemplate}
                  disabled={true}
                />
              </>
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
            updateOrder(
              patchOrderEngagements({
                order,
                updateTemplates: [updatedTemplate],
              })
            )
          }
          onTemplateDelete={handleTemplateDelete}
        />

        <Button
          className="w-full"
          onClick={() => {
            onCreateEngagement();
            selectedTemplates.map(onSelectTemplate);
          }}
          disabled={selectedTemplates.length === 0}
        >
          Vai
        </Button>
      </TabsContent>
    </Tabs>
  );
}
